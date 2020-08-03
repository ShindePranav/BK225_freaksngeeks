pragma solidity >= 0.5.0 < 0.7.0;
pragma experimental ABIEncoderV2;

contract AcceptBid  {
    
  address public manager;
    
  struct bidDetails{
        string bidId; //i.e. bidding id
        uint tenderRefNo;
        string tenderName;
        uint bidSubmissionOpeningDate;
        uint bidSubmissionClosingDate;
        string bidderId;
        uint biddingDate;
        uint status;  
        // SUBMITTED, TECHNICAL ACCEPETED, REJECTED, AWARDED
        uint bidAmount;
        string key;
  }
     
  mapping( string => bidDetails ) private BidMap;
  mapping(string => uint) private idExist;
  string[] public bidMaps;

  //event AcceptedBid(string memory biddingId, uint tenderRefNo, string memory bidderId, uint biddingDate);
  modifier onlyPresent(string memory _bidId){   require(idExist[_bidId]==1,"No entry Present!"); _;   }

  modifier checkStatus(string memory _bidId){   require(BidMap[_bidId].status==1,"Not Accessible Technically");  _; }
  
  modifier onlyManager(){  require(msg.sender==manager,"Access Denied!"); _;  }
  
  modifier afterTenderClosingDate(string memory _bidId) {  require(BidMap[_bidId].bidSubmissionClosingDate < now,"Bidding Not Closed!"); _; }

  modifier alreadyPresent(string memory _bidId){    require(idExist[_bidId]==0,"Duplicate Entry!"); _;  }

  modifier newStatusValidity(uint newStatus) {    
    require(newStatus>0,"Invalid Status");
    require(newStatus<4,"Invalid Status");
     _;  }

  constructor() public { manager=msg.sender;  }

  function acceptBid( string memory _bidId,uint _tenderRefNo,string memory _tenderName,uint _bidSubmissionOpeningDate,
    uint _bidSubmissionClosingDate,string memory _bidderId, string memory _key, uint _bidAmount)
    public //checkPresence(_bidId) 
    alreadyPresent(_bidId)
     returns (string memory bidderId){
      BidMap[_bidId].bidId=_bidId;
      BidMap[_bidId].tenderRefNo=_tenderRefNo;
      BidMap[_bidId].tenderName=_tenderName;
      BidMap[_bidId].bidSubmissionOpeningDate=_bidSubmissionOpeningDate;
      BidMap[_bidId].bidSubmissionClosingDate=_bidSubmissionClosingDate;
      BidMap[_bidId].biddingDate=now;
      BidMap[_bidId].bidderId=_bidderId;
      BidMap[_bidId].key=_key;
      BidMap[_bidId].bidAmount=_bidAmount;
      BidMap[_bidId].status=0;
      idExist[_bidId]=1;
      bidMaps.push(_bidId);
      return BidMap[_bidId].bidderId;
  }
    
  function displayAllBids() public view returns (string[] memory ){  return bidMaps;   }
  
  function displayTechnicalBid(string memory _bidId) public view onlyManager //afterTenderClosingDate( _bidId )
      onlyPresent(_bidId) returns (string memory _biddingId,uint biddingStatus){ //uint referenceNo, string  tenderTitle, string  bidderId, 
    
      return(BidMap[_bidId].bidId,BidMap[_bidId].status); //BidMap[_bidId].tenderRefNo,BidMap[_bidId].tenderName,BidMap[_bidId].bidderId,  
  }
  
  function displayFinancialBid(string memory _bidId)  public view  checkStatus(_bidId) 
      returns (string memory key, uint bidAmount){
      return(BidMap[_bidId].key,BidMap[_bidId].bidAmount);
  }

 function updateStatus(string memory _bidId, uint newStatus) public onlyManager newStatusValidity(newStatus) 
 returns (bool){
    if(BidMap[_bidId].status<newStatus){
      if(BidMap[_bidId].status==2){
        revert("Can not change State from REJECTED to ACCEPTED!");
      }
      BidMap[_bidId].status=newStatus;
      return true;
    }
    else{
      revert("Invalid Status update requested!");
    }
 }
}
  //function modifyBidClosingDate() {}  
  //Modify it later Dont allow Engineer to view BidderId or bidderName
    
/*
  Commands-------------
  
  AcceptBid.deployed().then(function(res){ accept =res ; })
  
  accept.displayAllBids()
  
  accept.acceptBid("b1","11","name","1111","2000","bidderId1","1234","500000")
  
  accept.displayTechnicalBid("b1")

 accept.updateStatus("b1","1")

  accept.displayFinancialBid("b1")
  
  accept.updateStatus("b1","3")      
  Technically Accepted => Awarded

  accept.displayAllBids()
  
  
  modifier checkPresence(uint _tenderRefNo){
    require(BidMap[_bidId].bidId!=_bidId,"");
    _;
    
  }
  
  function checkBidPresence(uint _bidId)  returns (bool ){
    if(BidMap[_bidId].bidId==_bidId)
      return true;
    else
      return false;
}*/
