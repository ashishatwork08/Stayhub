const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing = require("./models/listing.js")
const path=require("path");
const methodOverride = require("method-override")
const ejsMate= require("ejs-mate");

const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust';

main() 
    .then(()=> {
        console.log("connected to database");
    })
    .catch((err)=>{
        console.log("Database not connected error");
    }
)

async function main() {
    await mongoose.connect(MONGO_URL)
}
app.get("/",(req,res)=> {
    res.send("Hi,I am root");
});

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));             // This ensures Express always finds your EJS files correctly.
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Index route
app.get("/listings",async (req,res) =>{
    const allListings=await Listing.find({});
    res.render("listings/index", {allListings});
    });

    //New route
    app.get("/listings/new", async (req,res)=>
    {
        res.render("listings/new.ejs")
    });

// Show route
app.get("/listings/:id", async (req,res)=>
{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show",{listing});
});
// CReate route
app.post("/listings",async (req,res)=>
{
    const listing=new Listing(req.body.listing)
    await listing.save();
    res.redirect("/listings");
console.log(listing);
});
// Edit Route
app.get("/listings/:id/edit",async (req,res)=>
{
     let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit", {listing});
});
// Update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  res.redirect(`/listings/${id}`);
});

// Delete Route
app.delete("/listings/:id", async (req,res) => {
     let { id } = req.params;
  let deletedlisting=await Listing.findByIdAndDelete(id);
  console.log(deletedlisting);
  res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});