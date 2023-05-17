export const CapitlizeFirst=(str)=>{

      const arr=str.toLowerCase().split(" ");
      for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
      
      }
      
      const arr2= arr.join(" ");
      console.log(arr2);
      return arr2;
      ;
  }