var members= ['egoing','k8805','muyaho'];
console.log(members[1]);
// #1.
members.forEach(function (value,index){
    console.log(`forEach문: ${value}`);
})
//#2.
for(var i of members){
    console.log(`for-in: ${i}`);
}
//#3.
for (var i in members){
    console.log(`for-of: ${members[i]}`);
}

var roles ={
    'programmer':'egoing',
    'designer':'k8805',
    'manager':'muyaho'
};
console.log(roles.manager);
for (var i in roles){
    console.log(`객체: ${roles[i]}`);
}