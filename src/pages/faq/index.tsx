import { CardTemplate } from "@/components";
import { CardWrapper } from "@/components/templates/CardWrapper";
import { PageTemplate } from "@/components/templates/PageTemplate";

export default function IssueBadgePage() {
  return (
    <PageTemplate className="" title={"FAQ"}>
      <CardWrapper className="flex">
        <CardTemplate className="bg-whiteOpacity005 p-8 border border-whiteOpacity05 w-[calc(33vw-26px-1.5rem)] hover:bg-whiteOpacity008">
          <div className="w-full flex justify-center">
            <h2 className="text-2xl font-bold pt-1 pb-3 text-whiteOpacity05">
              Why Trustful?
            </h2>
          </div>
          <span className="text-md pt-10">
            Trustful values effort and the track record of past contributions,
            providing a fair and transparent way to build, verify, and manage
            reputation systems within communities. It&apos;s a customizable,
            decentralized solution that integrates with the Stellar ecosystem,
            empowering users to prove their contributions over time.
          </span>
        </CardTemplate>
        <CardTemplate className="bg-whiteOpacity005 p-8 border border-whiteOpacity05 w-[calc(33vw-27px-1.5rem)] hover:bg-whiteOpacity008">
          <div className="w-full flex justify-center">
            <h2 className="text-2xl font-bold pt-1 pb-3 text-whiteOpacity05">
              Why import badges?
            </h2>
          </div>
          <span className="text-md pt-10">
            Importing badges allows you to consolidate your achievements and
            reputation across multiple platforms. These badges are linked to
            reputation scores, which can unlock opportunities like roles,
            grants, or ambassador programs within Stellar and other dApps.
          </span>
        </CardTemplate>
        <CardTemplate className="bg-whiteOpacity005 p-8 border border-whiteOpacity05 w-[calc(34vw-27px-1.5rem)] hover:bg-whiteOpacity008">
          <div className="w-full flex justify-center">
            <h2 className="text-2xl font-bold pt-1 pb-5 text-whiteOpacity05">
              How can communities verify my reputation?
            </h2>
          </div>
          <span className="text-md pt-10">
            Communities can verify your reputation by searching your Stellar
            public address. This will display all linked badges and their
            associated reputation scores.
          </span>
        </CardTemplate>
        <CardTemplate className="bg-whiteOpacity005 p-8 border border-whiteOpacity05 w-[calc(49.5vw-40px-0.75rem)] hover:bg-whiteOpacity008">
          <div className="w-full flex justify-center">
            <h2 className="text-2xl font-bold pt-1 pb-8 text-whiteOpacity05">
              How can I create a reputation framework for my community?
            </h2>
          </div>
          <span className="text-md pt-10">
            In the MVP version, you can start building a reputation system by
            using predefined badges and scorers. Once decentralized contracts
            are deployed, you’ll be able to create custom reputation badges,
            scorers, and attestations for your community.
          </span>
        </CardTemplate>
        <CardTemplate className="bg-whiteOpacity005 p-8 border border-whiteOpacity05 w-[calc(49.5vw-40px-0.75rem)] hover:bg-whiteOpacity008">
          <div className="w-full flex justify-center">
            <h2 className="text-2xl font-bold pt-1 pb-8 text-whiteOpacity05">
              What are the benefits of using Trustful?
            </h2>
          </div>
          <span className="text-md pt-10">
            Trustful empowers better decision-making, fair resource allocation,
            role assignment, and participation in exclusive events like
            ambassador programs or grants. It also provides a trusted,
            data-backed way to reward members for their contributions, ensuring
            that effort and past achievements are recognized.
          </span>
        </CardTemplate>
      </CardWrapper>
    </PageTemplate>
  );
}
