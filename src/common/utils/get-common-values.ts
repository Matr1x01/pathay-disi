const getCommonValues = (arr1: Array<any>, arr2: Array<any>): Array<any> => {
  const set2 = new Set(arr2);

  // Filter the first array, keeping only elements that exist in the Set
  return arr1.filter((item) => set2.has(item));
};
export default getCommonValues;
