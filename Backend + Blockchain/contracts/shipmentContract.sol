pragma solidity >=0.5.0 <0.7.0;

contract shipmentContract{

address owner;

string location; uint quantity; string product;
address receiverAddess;

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
mapping (address=>uint) accbalance;
mapping(string=>AssetTransfer)assetTransfer;


address[] intermediates;

function getProduct(string memory _tag)public view returns (address ,string memory,uint,string memory,string memory){
return(products[_tag].producer,products[_tag].name,products[_tag].quantity,products[_tag].tag,products[_tag].proddescription);}    


function sendShipment(string memory _asset,string memory trackingNo, string memory _destination,uint _quantity,address _reciever)public returns(bool){
if(msg.sender==receiverAddess||msg.sender==owner){
assetTransfer[trackingNo].asset=_asset;
assetTransfer[trackingNo].shipmentlocation=_destination;
assetTransfer[trackingNo].trackingNo=trackingNo;
assetTransfer[trackingNo].quantity=_quantity;
assetTransfer[trackingNo].sender=msg.sender;
assetTransfer[trackingNo].receiver=_reciever;}
else{assetTransfer[trackingNo].intermediate=msg.sender;
}
emit Shipped("shipment sent", trackingNo, msg.sender, _destination);
return true;}



function setconditions(string memory _location,uint _quantity,address _receiverAddess,string memory _asset)public{
location=_location;//current location
quantity=_quantity;
receiverAddess=_receiverAddess;//destination address
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
}


//receiver--0x38C8EEC08c97875a1A506134993a9196bfc79E6F--sender
//sender--0x828BEc28739f5c8abd110d51f5fC9adC76c30C4e
//new receiver-- 0x7346Eb2DF4BEC721c39060223554Ec9C4405dbC0
// Sequence

// setcondition-----shippment dashbord
// sendShipment-->owner address---
//getshipment-->intermediate address-----
//sendshipemnt-->intermediate address-----
//getshipemnt-->destination address----

//owner= address[0]
//intermediate=address[1]
//destination=address[last]


//set conditions --"pune","100","0xdD870fA1b7C4700F2BD7f44238821C26f7392148","pipes"   from onwer
