pragma solidity >=0.5.0 <0.7.0;

contract project3{

address owner;

string location; uint quantity; string product; //uint payment; 
address senderAddess;
struct Users{
string companyName; 
string role;
string country;
string city;
uint phoneNo;
string physicalAddress; 
bool certified;
}

struct Product{
address producer;    
string name;
uint quantity;
string tag;
string proddescription;
}

struct AssetTransfer{
string shipmentlocation;
string asset; 
address sender; 
address receiver;
string trackingNo;
uint quantity;
}

constructor (uint _tokens)public{
owner=msg.sender;
accbalance[owner]=_tokens;    
}

event Message(string message);
event Shipped(string _message, string trackingno, address _sender,string location);

modifier only_admin{
require(msg.sender==owner);
_;}

mapping (string=>Product)products;

mapping(address=>Users)users;

mapping (address=>uint) accbalance;

mapping(string=>AssetTransfer)assetTransfer;

address[] private stakeholders;

string[]private goods;



function getProduct(string memory _tag)public view returns (address ,string memory,uint,string memory,string memory){
return(products[_tag].producer,products[_tag].name,products[_tag].quantity,products[_tag].tag,products[_tag].proddescription);}    


function sendShipment(string memory _asset,string memory trackingNo, string memory _destination,uint _quantity,address _reciever, address _sender)public returns(bool){
assetTransfer[trackingNo].asset=_asset;
assetTransfer[trackingNo].shipmentlocation=_destination;
assetTransfer[trackingNo].trackingNo=trackingNo;
assetTransfer[trackingNo].quantity=_quantity;
assetTransfer[trackingNo].sender=_sender;
assetTransfer[trackingNo].receiver=_reciever;
emit Shipped("shipment sent", trackingNo, _sender, _destination);
return true;}



function setconditions(string memory _location,uint _quantity,address _senderAddess,string memory _asset,address _seller)public{
location=_location;
quantity=_quantity;
//payment=_payment;
senderAddess=_senderAddess;
product=_asset;
_seller=msg.sender; 
emit Message('conditions are set'); }


//alloting shipment
function getshipment(string memory _location,uint _quantity,string memory _asset,string memory trackingNo)public returns(bool){
if((assetTransfer[trackingNo].quantity)==_quantity && 
keccak256(abi.encodePacked(assetTransfer[trackingNo].asset))==keccak256(abi.encodePacked(_asset))){
emit Shipped('Shipment recieved',trackingNo,msg.sender,_location);    
/*//if (keccak256(abi.encodePacked(location))==keccak256(abi.encodePacked(_location))){
//makepayment(assetTransfer[trackingNo].receiver,assetTransfer[trackingNo].sender,payment);}
//else{
//emit Message('Payment not made');}    
//return true;}
//else{
//emit Message('wrong location/quantity/item');    
//return false;}*/
return true;}
}

//history of shipment
function showProvenance(string memory _trackingNo)public view returns(string memory,string memory, address,address,string memory){
return(assetTransfer[_trackingNo].asset,
assetTransfer[_trackingNo].trackingNo, 
assetTransfer[_trackingNo].sender,
assetTransfer[_trackingNo].receiver,
assetTransfer[_trackingNo].shipmentlocation);
    
}
}
