// import { TagIcon } from "@/components";
// import { CustomModal } from "@/pages/communities/components/molecules/custom-modal";

// export const ReputationDetailsModal = (isOpen, closeModal) => {

//     return (
//         <CustomModal
//                 title="Stellar Quest"
//                 isOpen={isOpen("details")}
//                 onClose={() => closeModal("details")}
//                 isAsync={false}
//             >
//                 <>
//                     <div className="flex p-6 gap-2 items-center">
//                         <div><TagIcon className="w-4" /></div>
//                         <div className="text-gray-500 text-xs">2,000 points /</div>
//                         <div><TagIcon className="w-4" /></div>
//                         <div className="text-gray-500 text-xs">2/20 badges</div>
//                     </div>
//                     <div className="w-[552px] mb-4 ml-4 mr-4 bg-whiteOpacity005 rounded-xl">
//                         <div className="flex flex-col border border-whiteOpacity005 rounded-xl max-h-[440px]">

//                             <div className="flex justify-between items-center border-b border-whiteOpacity005 px-6 py-4">
//                                 <span className="text-sm  text-left">Name</span>
//                                 <span className="text-sm w-24 text-right">Score</span>
//                                 <span className="text-sm w-24 text-center">Status</span>
//                             </div>

//                             {reputation.map((item, index) => (
//                                 <div key={index} className="flex justify-between items-center px-6 py-4">
//                                     <span className="text-sm text-whiteOpacity05 text-left">{item.name}</span>
//                                     <span className="text-sm text-brandWhite w-24 text-left">{item.score}</span>
//                                     <span className={`text-xs w-24 text-center p-1 rounded-3xl bg-darkGreenOpacity01 ${item.statusColor}`}>
//                                         {item.status}
//                                     </span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>

//                 </>
//             </CustomModal>
//     )
// }