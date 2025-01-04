export function camelCaseToUpperCaseWords(s: string) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.toUpperCase();;
  }
  
  