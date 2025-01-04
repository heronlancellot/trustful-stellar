export const convertQuestNameToPresentation = (badgeSetNameFromApi: string) => {
  return badgeSetNameFromApi.replaceAll("-", " ");
};
