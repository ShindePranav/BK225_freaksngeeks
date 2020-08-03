pragma solidity >=0.5.0 <0.7.0;

contract shipmentContract{

address owner;

string location; uint quantity; string product; //uint payment; 
address receiverAddess;
/*struct Users{
string companyName; 
string role;
string country;
string city;
uint phoneNo;
string physicalAddress; 
bool certified;
}
*/

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
address intermediate;
address receiver;
string trackingNo;
uint quantity;
}

constructor ()public payable{
owner=msg.sender;
accbalance[owner]=msg.value;    
}

event Message(string message);
event Shipped(string _message, string trackingno, address _sender,string location);

modifier only_admin{
require(msg.sender==owner);
_;}

mapping (string=>Product)products;
//mapping(address=>Users)users;
mapping (address=>uint) accbalance;
mapping(string=>AssetTransfer)assetTransfer;

//address[] private stakeholders;
//string[]private goods;

address[] intermediates;
//intermediates.push(msg.sender);
//
function getProduct(string memory _tag)public view returns (address ,string memory,uint,string memory,string memory){
return(products[_tag].producer,products[_tag].name,products[_tag].quantity,products[_tag].tag,products[_tag].proddescription);}    


function sendShipment(string memory _asset,string memory trackingNo, string memory _destination,uint _quantity,address _reciever)public returns(bool){
if(msg.sender!=receiverAddess)
{assetTransfer[trackingNo].asset=_asset;
assetTransfer[trackingNo].shipmentlocation=_destination;
assetTransfer[trackingNo].trackingNo=trackingNo;
assetTransfer[trackingNo].quantity=_quantity;
assetTransfer[trackingNo].sender=msg.sender;
assetTransfer[trackingNo].receiver=_reciever;
if(msg.sender!=owner)
assetTransfer[trackingNo].intermediate=msg.sender;

}


emit Shipped("shipment sent", trackingNo, msg.sender, _destination);
return true;}



// function intermediatePoints(string memory _asset,string memory trackingNo, string memory _destination,uint _quantity,address _reciever, address _sender)public returns(bool){
// assetTransfer[trackingNo].asset=_asset;
// assetTransfer[trackingNo].shipmentlocation=_destination;//current location
// assetTransfer[trackingNo].trackingNo=trackingNo;
// assetTransfer[trackingNo].quantity=_quantity;
// assetTransfer[trackingNo].sender=_sender;
// assetTransfer[trackingNo].receiver=_reciever;
// intermediates.push(msg.sender);
// emit Shipped("shipment sent", trackingNo, _sender, _destination);
// return true;}



function setconditions(string memory _location,uint _quantity,address _receiverAddess,string memory _asset)public{
location=_location;
quantity=_quantity;
//payment=_payment;
receiverAddess=_receiverAddess;
product=_asset;
 
emit Message('conditions are set'); }


//alloting shipment
function getshipment(string memory _location,uint _quantity,string memory _asset,string memory trackingNo)public returns(bool){
if((assetTransfer[trackingNo].quantity)==_quantity && 
keccak256(abi.encodePacked(assetTransfer[trackingNo].asset))==keccak256(abi.encodePacked(_asset))){
emit Shipped('Shipment recieved',trackingNo,msg.sender,_location);    
if (msg.sender==receiverAddess){
    msg.sender.transfer(accbalance[owner]); 
}
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
function showProvenance(string memory _trackingNo)public view returns(string memory,string memory, address,address,address,string memory){
return(assetTransfer[_trackingNo].asset,
assetTransfer[_trackingNo].trackingNo, 
assetTransfer[_trackingNo].sender,
assetTransfer[_trackingNo].intermediate,
assetTransfer[_trackingNo].receiver,
assetTransfer[_trackingNo].shipmentlocation);
    
}


function getAllCryptographersAddresses() public view returns (address[] memory) {
    return intermediates;
}}


//receiver--0x38C8EEC08c97875a1A506134993a9196bfc79E6F--sender
//sender--0x828BEc28739f5c8abd110d51f5fC9adC76c30C4e
//new receiver-- 0x7346Eb2DF4BEC721c39060223554Ec9C4405dbC0
// Sequence
// setcondition
// sendShipment-->owner address
//getshipment-->intermediate address
//sendshipemnt-->intermediate address
//getshipemnt-->destination address

