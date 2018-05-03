if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://arpit:arpit@ds139715.mlab.com:39715/vidjot'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost:27017'}
}