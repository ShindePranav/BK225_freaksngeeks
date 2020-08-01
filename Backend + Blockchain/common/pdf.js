
const Express=require ("express");
const upload=require("express-fileupload")


const app=Express()
app.use(upload())
app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/index1.html')
 
})
app.post('/',(req,res)=>{
   if(req.files){
        console.log(req.files)
        var file=req.files.file
        var filename=file.name
        console.log(filename)
        file.mv('./upload/'+filename,function(err){
            if(err){
              //  console.log('errror:failed to dowload the file')
               // return res.status(500).send(err);
                res.send(err)
            }else{
                res.send("file uploaded")
            }
        });
        
    }
});
app.listen(5000,()=>{
    console.log("server is listening at port 5000")
})