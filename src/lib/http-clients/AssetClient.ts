import httpClient from "./HttpClient";

export class AssetClient {
  static assetPath = "asset";
  static defaultCommunity = "stellar";

  async postAsset(
    receivingPublicKey: string,
    assetName: string[],
    community?: string
  ) {
    const { transaction } = await httpClient.post<
      any,
      Object,
      { receivingPublicKey: string; assetName: string[]; community: string }
    >(
      AssetClient.assetPath,
      {},
      {
        receivingPublicKey,
        assetName,
        community: community ?? AssetClient.defaultCommunity,
      }
    );

    return transaction;
  }
}

const assetClient = new AssetClient();
export default assetClient;
