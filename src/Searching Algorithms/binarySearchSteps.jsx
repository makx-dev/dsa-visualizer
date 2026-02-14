// generate steps invloved in binary search
export function binarySearchSteps(inputArray, target) {
    const sorted = [...inputArray].sort((a,b)=>(a-b)); // sort array for BS
    const array = [...inputArray];
    const steps = [];
    let high = sorted.length-1; // put high on last index of sorted array
    let low = 0;
    while(low <= high) {
        steps.push({
            type:'range', low, high, array:[...sorted]
        }); // get whole array as range in start
        const mid = Math.floor((low+high)/2); 
        steps.push({
            type:'mid',
            index: mid,
            array:[...sorted]
        }) // mid in arr as step
        steps.push({ 
            type: 'compare', index: mid, value: sorted[mid], array:[...sorted]
        }); // mid of sorted arr
        if(sorted[mid] === target) {
            steps.push({
                type:'found',
                index:mid,
                array:[...sorted]
            }) // if found return steps immediately
            return steps;
        }
        if(sorted[mid] < target) low = mid + 1;
        else high = mid - 1; 
    }
    steps.push({
        type:'not_found',
        array:[...sorted]
    }) // return steps when not found
    return steps;
}