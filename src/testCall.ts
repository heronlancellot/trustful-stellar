import {
    rpc,
    Keypair,
    TransactionBuilder,
    BASE_FEE,
    Networks,
    Operation,
    Address,
    Contract,
    TimeoutInfinite,
} from "@stellar/stellar-sdk";
import {
    ALBEDO_ID, ISupportedWallet, StellarWalletsKit,
    WalletNetwork,
    allowAllModules,
    XBULL_ID,
} from "@creit.tech/stellar-wallets-kit";

const FRIENDBOT_URL = "https://friendbot-testnet.stellar.org/";
const RPC_URL = "https://soroban-testnet.stellar.org";
const CONTRACT_ID = "CA7ZX4HWYPPB6BJJRWXLIAYS5L752V32MJRZM3AL7PXCCYPVL2ZNN6S7";

// Função para adicionar um usuário
export async function addUser(userToAdd: string): Promise<any> {

    try {
        const aliceSecret = "SCN4N2G6BAKVISPVULAS6ZLK57UJJLOMF5QPS73IJWRRRAD66ZF3UX6X"; // Isso aqui não pode ter no teu codigo pq é a senha do usuário 
        const keypair = Keypair.fromSecret(aliceSecret);
        const publicKey = keypair.publicKey();
        console.log("Using sender public key (Alice):", publicKey);

        // Inicializar o servidor RPC
        const server = new rpc.Server(RPC_URL, { allowHttp: true });

        // Obter os detalhes da conta
        const account = await server.getAccount(publicKey);

        // Criar o contrato
        const contract = new Contract(CONTRACT_ID);

        const kit: StellarWalletsKit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            selectedWalletId: XBULL_ID,
            modules: allowAllModules(),
        });

        await kit.openModal({
            onWalletSelected: async (option: ISupportedWallet) => {
                if (option.id === ALBEDO_ID) { // Ensure only Albedo is selected
                    kit.setWallet(option.id);
                    const { address } = await kit.getAddress();
                    console.log("Selected wallet address:", address);
                    // Proceed with contract interaction
                }
            },
            modalTitle: "Connect with Albedo",
            notAvailableText: "Albedo Wallet is required for this operation.",
        });

        // await kit.setWallet('GD7IDV44QE7CN35M2QLSAISAYPSOSSZTV7LWMKBU5PKDS7NQKTFRZUTS')

        // Construir a transação com a operação de chamada do contrato
        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(
                Operation.invokeContractFunction({
                    function: "add_user",
                    contract: CONTRACT_ID,
                    args: [new Address(publicKey).toScVal(), new Address(userToAdd).toScVal()]
                })
            )
            .setTimeout(TimeoutInfinite)
            .build();

        // Assinar a transação
        transaction.sign(keypair);

        // Preparar a transação
        const preparedTransaction = await server.prepareTransaction(transaction);
        preparedTransaction.sign(keypair);

        // Enviar a transação
        const sendResponse = await server.sendTransaction(preparedTransaction);

        // Verificar o status da transação enviada
        if (sendResponse.status === "PENDING") {
            // Aguardar a confirmação da transação
            let txResponse;
            let attempts = 0;
            const maxAttempts = 10;

            do {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos
                txResponse = await server.getTransaction(sendResponse.hash);
                attempts++;
            } while (
                txResponse.status === "NOT_FOUND" &&
                attempts < maxAttempts
            );

            if (txResponse.status === "SUCCESS") {
                return {
                    success: true,
                    transactionId: sendResponse.hash,
                    result: txResponse
                };
            } else {
                return {
                    success: false,
                    error: `Transaction failed with status: ${txResponse.status}`,
                    transactionId: sendResponse.hash,
                    result: txResponse
                };
            }
        } else {
            // Extrair mais detalhes do erro
            let errorDetails = "Unknown error";
            try {
                errorDetails = JSON.stringify(sendResponse);
            } catch (e) {
                errorDetails = "Error parsing error details";
            }

            return {
                success: false,
                error: `Transaction submission failed with status: ${sendResponse.status}`,
                errorDetails: errorDetails,
                result: sendResponse
            };
        }

    } catch (error) {
        console.error("Error in addUser:", error);
        return {
            success: false,
            error: '',
            details: error
        };
    }
}

// Função para criar e financiar um novo usuário
async function createAndFundUser(): Promise<{ publicKey: string, secret: string }> {
    // Gerar um novo keypair aleatório
    const newUserKeypair = Keypair.random();
    const newUserPublicKey = newUserKeypair.publicKey();
    const newUserSecret = newUserKeypair.secret();

    console.log("Created new user with public key:", newUserPublicKey);

    // Financiar a conta usando Friendbot
    try {
        const response = await fetch(`${FRIENDBOT_URL}?addr=${newUserPublicKey}`);
        if (!response.ok) {
            throw new Error(`Failed to fund account: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Account funded successfully:", result.hash);

        return {
            publicKey: newUserPublicKey,
            secret: newUserSecret
        };
    } catch (error) {
        console.error("Error funding account:", error);
        throw error;
    }
}

export async function mainTestnet() {
    try {
        // Criar e financiar um novo usuário
        console.log("Creating and funding new user...");
        const newUser = await createAndFundUser();
        console.log("New user created and funded successfully!");
        console.log("Public Key:", newUser.publicKey);
        console.log("Secret Key:", newUser.secret);

        // Adicionar o novo usuário ao contrato
        console.log("\nAdding user to contract...");
        const response = await addUser(newUser.publicKey);
        console.log("Transaction response:", response);

        if (response.success) {
            console.log("User added successfully!");
            console.log("Transaction ID:", response.transactionId);
        } else {
            console.error("Failed to add user:", response.error);
            console.error("Error details:", response.errorDetails);
        }
    } catch (err) {
        console.error("Error in main:", err);
    }
}

// main();