var array1 = ['banana', 'apple', 'orange'];
var array2 = array1;
array1[2] = 'blueberry';
for(var data in array2){
    console.log(array2[data]);
}