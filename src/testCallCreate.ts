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
    xdr,
    scValToNative,
    nativeToScVal,
} from "@stellar/stellar-sdk";

const FRIENDBOT_URL = "https://friendbot-testnet.stellar.org/";
const RPC_URL = "https://soroban-testnet.stellar.org";

// Estrutura para o BadgeId
interface BadgeId {
    name: string;
    issuer: string;
}

// Função para criar um novo contrato scorer
async function createScorer(
    factoryContractId: string,
    adminSecret: string,
    badges: Array<{ name: string, issuer: string, score: number }>,
    name: string,
    description: string,
    icon: string
): Promise<any> {
    try {
        // Carregar a chave do administrador
        const keypair = Keypair.fromSecret(adminSecret);
        const adminPublicKey = keypair.publicKey();
        console.log("Using admin public key:", adminPublicKey);

        // Inicializar o servidor RPC
        const server = new rpc.Server(RPC_URL, { allowHttp: true });

        // Obter os detalhes da conta
        const account = await server.getAccount(adminPublicKey);

        // Gerar um salt aleatório (32 bytes)
        const saltBuffer = Buffer.alloc(32);
        for (let i = 0; i < 32; i++) {
            saltBuffer[i] = Math.floor(Math.random() * 256);
        }

        // Converter o salt para xdr.ScVal
        const saltScVal = xdr.ScVal.scvBytes(saltBuffer);

        // Preparar argumentos de inicialização
        // 1. Admin address
        const adminAddressScVal = new Address(adminPublicKey).toScVal();

        // 2. Preparar o mapa de badges
        const badgeMapEntries: xdr.ScMapEntry[] = [];

        for (const badge of badges) {
            // Criar a estrutura BadgeId como um vec de valores em vez de um mapa
            const badgeIdVector = xdr.ScVal.scvVec([
                xdr.ScVal.scvString(badge.name),
                new Address(badge.issuer).toScVal()
            ]);

            // Adicionar a entrada ao mapa de badges
            badgeMapEntries.push(new xdr.ScMapEntry({
                key: badgeIdVector,
                val: xdr.ScVal.scvU32(badge.score)
            }));
        }

        const badgeMapScVal = xdr.ScVal.scvMap(badgeMapEntries);

        // 3. Nome, descrição e ícone
        const nameScVal = xdr.ScVal.scvString(name);
        const descriptionScVal = xdr.ScVal.scvString(description);
        const iconScVal = xdr.ScVal.scvString(icon);

        // Construir o array de argumentos de inicialização
        const initArgsArray = [
            adminAddressScVal,
            badgeMapScVal,
            nameScVal,
            descriptionScVal,
            iconScVal
        ];

        // Converter para ScVec
        const initArgsScVal = xdr.ScVal.scvVec(initArgsArray);

        // Construir a transação com a operação de chamada do contrato
        const transaction = new TransactionBuilder(account, {
            fee: BASE_FEE,
            networkPassphrase: Networks.TESTNET
        })
            .addOperation(
                Operation.invokeContractFunction({
                    function: "create_scorer",
                    contract: factoryContractId,
                    args: [
                        new Address(adminPublicKey).toScVal(),  // deployer
                        saltScVal,                              // salt
                        xdr.ScVal.scvSymbol("initialize"),      // init_fn
                        initArgsScVal                           // init_args
                    ]
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
                // Extrair o endereço do contrato scorer dos resultados
                let scorerAddress = "";
                if (txResponse.resultMetaXdr) {
                    try {
                        const resultValue = scValToNative(txResponse.returnValue as any);
                        // Se o valor de retorno for um endereço, deve estar no formato adequado
                        if (typeof resultValue === 'string') {
                            scorerAddress = resultValue;
                        }
                    } catch (error) {
                        console.error("Error parsing return value:", error);
                    }
                }

                return {
                    success: true,
                    scorerAddress: scorerAddress,
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

    } catch (error: any) {
        console.error("Error in createScorer:", error);
        return {
            success: false,
            error: error.message,
            details: error
        };
    }
}

// Função para criar e financiar uma nova conta para testes
async function createAndFundAccount(): Promise<{ publicKey: string, secret: string }> {
    // Gerar um novo keypair aleatório
    const newKeypair = Keypair.random();
    const newPublicKey = newKeypair.publicKey();
    const newSecret = newKeypair.secret();

    console.log("Created new account with public key:", newPublicKey);

    // Financiar a conta usando Friendbot
    try {
        const response = await fetch(`${FRIENDBOT_URL}?addr=${newPublicKey}`);
        if (!response.ok) {
            throw new Error(`Failed to fund account: ${response.statusText}`);
        }
        const result = await response.json();
        console.log("Account funded successfully:", result.hash);

        return {
            publicKey: newPublicKey,
            secret: newSecret
        };
    } catch (error) {
        console.error("Error funding account:", error);
        throw error;
    }
}

async function main() {
    try {
        // Definir o ID do contrato factory
        const FACTORY_CONTRACT_ID = "CB6U2W3AJNUEYFDVT5MEXOTEUEMHM5P64XKN2S5KUHI26HBGJBT7CULH";

        // Para testes: criar e financiar uma nova conta de administrador
        console.log("Creating and funding admin account...");
        const admin = await createAndFundAccount();
        console.log("Admin account created and funded successfully!");
        console.log("Admin Public Key:", admin.publicKey);

        // Criar alguns badges para o novo scorer - simplificando a estrutura
        const badges = [
            {
                name: "SQL0001",
                issuer: admin.publicKey,
                score: 3
            },
            {
                name: "SQL0002",
                issuer: admin.publicKey,
                score: 5
            },
            {
                name: "SQL0003",
                issuer: admin.publicKey,
                score: 8
            }
        ];

        // Criar o contrato scorer
        console.log("\nCreating scorer contract...");
        const response = await createScorer(
            FACTORY_CONTRACT_ID,
            admin.secret,
            badges,
            "New Scorer",
            "This is a new scorer contract",
            "icon.png"
        );

        if (response.success) {
            console.log("Scorer contract created successfully!");
            console.log("Scorer Contract Address:", response.scorerAddress);
            console.log("Transaction ID:", response.transactionId);

            // Salvar as informações para uso posterior
            console.log("\nScorer Contract Details:");
            console.log(`NETWORK=testnet`);
            console.log(`SCORER_ADDRESS=${response.scorerAddress}`);
            console.log(`ADMIN_ADDRESS=${admin.publicKey}`);
            console.log(`DEPLOYMENT_DATE=${new Date().toISOString()}`);
        } else {
            console.error("Failed to create scorer contract:", response.error);
            if (response.errorDetails) {
                console.error("Error details:", response.errorDetails);
            }
        }
    } catch (err) {
        console.error("Error in main:", err);
    }
}

main();