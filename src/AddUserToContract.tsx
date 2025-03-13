"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components";
import { WalletIcon } from "@/components/atoms/icons/WalletIcon";
import { useAuthContext } from "@/components/auth/Context";
import { kit } from "@/components/auth/ConnectStellarWallet";
import { ALBEDO_ID } from "@creit.tech/stellar-wallets-kit";
import {
    rpc,
    TransactionBuilder,
    BASE_FEE,
    Networks,
    Operation,
    Address,
} from "@stellar/stellar-sdk";
import albedo from "@albedo-link/intent";

const HORIZON_URL = "https://horizon-testnet.stellar.org";
const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CA7ZX4HWYPPB6BJJRWXLIAYS5L752V32MJRZM3AL7PXCCYPVL2ZNN6S7";

export default function AddUserToContract() {
    const [userToAdd, setUserToAdd] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [transactionResult, setTransactionResult] = useState<string | null>(null);

    const { userAddress, setUserAddress } = useAuthContext();

    const handleAddUser = async () => {
        setIsLoading(true);
        setTransactionResult(null);

        try {
            // 1. Obter chave pública via Albedo
            const { pubkey } = await albedo.publicKey({ require_existing: true });

            // 2. Validar input do usuário
            if (!userToAdd) {
                throw new Error("O endereço do usuário é obrigatório.");
            }

            // 3. Carregar a conta do usuário via RPC
            const server = new rpc.Server(RPC_URL, { allowHttp: true });
            const account = await server.getAccount(pubkey);

            // 4. Criar transação
            const transaction = new TransactionBuilder(account, {
                fee: BASE_FEE,
                networkPassphrase: Networks.TESTNET
            })
                .addOperation(
                    Operation.invokeContractFunction({
                        function: "add_user",
                        contract: CONTRACT_ID,
                        args: [
                            new Address(pubkey).toScVal(),
                            new Address(userToAdd).toScVal()
                        ]
                    })
                )
                .setTimeout(30)
                .build();

            // 5. Preparar transação
            const preparedTransaction = await server.prepareTransaction(transaction);
            const transactionXDR = preparedTransaction.toXDR();

            // 6. Assinar com Albedo
            const signResult = await albedo.tx({
                xdr: transactionXDR,
                network: "testnet",
                submit: true
            });

            // 7. Exibir resultado
            setTransactionResult(signResult.tx_hash);
        } catch (error: any) {
            setTransactionResult(`Erro: ${error.message || "Falha ao processar a transação."}`);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-whiteOpacity008 rounded-lg">
            <h2 className="text-lg font-bold">Adicionar Usuário ao Contrato</h2>

            <div className="flex gap-2 my-4">
                <input
                    type="text"
                    value={userToAdd}
                    onChange={(e) => setUserToAdd(e.target.value)}
                    placeholder="GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-whiteOpacity005"
                />
                <PrimaryButton
                    label="Adicionar Usuário"
                    onClick={handleAddUser}
                    isLoading={isLoading}
                    className="rounded-lg bg-brandGreen text-black"
                    icon={<WalletIcon color="black" />}
                />
            </div>

            {transactionResult && (
                <div className="mt-4 text-sm">
                    {transactionResult.startsWith("Erro") ? (
                        <span className="text-red-500">{transactionResult}</span>
                    ) : (
                        <span>
                            Transação enviada com sucesso!{" "}
                            <a
                                href={`https://stellar.expert/explorer/testnet/tx/${transactionResult}`}
                                target="_blank"
                                className="text-blue-500"
                            >
                                Ver na blockchain
                            </a>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}