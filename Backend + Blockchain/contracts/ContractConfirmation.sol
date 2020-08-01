pragma solidity >= 0.5.0 < 0.7.0;
pragma experimental ABIEncoderV2;
import "./IssueTender.sol";
import "./AcceptBid.sol";


contract ContractConfirmation  {
    
    enum ContractStatus{
        AWAITING_PAYMENT, //Assuming 1st instalment already send
        AWAITING_DELIVERY, 
        PAYMENT_COMPLETED} //Completing 2nd instalment after acceptance at Store and QNA

    //Owner of Contract
    address public projectEngineer;
    
    struct ContractDetails{
        
        //Confirmed Contract Details
        string contractNumber; //Unique identifier
        uint contractDate; 
        uint  contractValue;
        ContractStatus status;
        
        //TenderDetails
        uint tenderRefNo;
        //IssueTender.TenderDetails tenderdetails;
          
        //Bid Details
        uint bidId;
        //AcceptBid.BidDetails bidDetails;
    }
    
    mapping(string => ContractDetails) ContractMap;
    
    string[] public Contracts;

    event ContractConfirmed(string contractNumber, uint contractDate, uint contractValue, uint tenderRefNo, uint bidId);

    constructor() public {
        projectEngineer=msg.sender;
    }
    
    function confirmContract(
        string memory _contractNumber,
        uint _contractValue,uint _tenderRefNo,uint _bidId
        ) public onlyEngineer           //validBid(  _bidId )
    returns (bool){
        
        ContractMap[_contractNumber].contractNumber=_contractNumber;
        ContractMap[_contractNumber].contractDate=now;
        ContractMap[_contractNumber].contractValue=_contractValue;
        ContractMap[_contractNumber].tenderRefNo=_tenderRefNo;
        ContractMap[_contractNumber].bidId=_bidId;
        ContractMap[_contractNumber].status= ContractStatus.AWAITING_PAYMENT;
        Contracts.push(_contractNumber)-1;
        emit ContractConfirmed(_contractNumber,now,_contractValue,_tenderRefNo,_contractValue);
        return true;
    }
    
    function viewConfirmedContract( string memory _contractNumber) 
    public view returns( string memory, uint , uint ,uint , uint ,uint ){
        uint status=statusToInt(ContractMap[_contractNumber].status);
        return ( ContractMap[_contractNumber].contractNumber, ContractMap[_contractNumber].contractDate,
                ContractMap[_contractNumber].contractValue, ContractMap[_contractNumber].tenderRefNo,
                ContractMap[_contractNumber].bidId,status);
    }
    
    function viewAllConfirmedContracts() public view returns (string[] memory){
        return Contracts;
    }
    /*modifier validBid(uint _bidId){
      require(AcceptBid.checkBidPresence(),"Invalid Bid");
      _;
    }*/

    modifier onlyEngineer(){
        require(msg.sender == projectEngineer, "Permission Denied (Confirm Contract)");
        _;
    }
function updateStatusOfContract(string memory _contractNumber, uint status )public payable onlyEngineer checkValidSatus(status) returns (bool){
    //------------------WRITE---------------
    if(status > statusToInt(ContractMap[_contractNumber].status)){
        ContractMap[_contractNumber].status= intToStatus(status);
        return true;
    }
    return false;
}


 function intToStatus(uint status) private pure checkValidSatus(status) returns(ContractStatus){
        if(status==0){
            return ContractStatus.AWAITING_PAYMENT;
        }
        else if(status == 1){
            return ContractStatus.AWAITING_DELIVERY;
        }
        else{
            return ContractStatus.PAYMENT_COMPLETED;
        }
    }
    
    function statusToInt(ContractStatus status) private pure returns (uint){
        if(status == ContractStatus.AWAITING_PAYMENT){
            return 0;
        }
        else  if(status == ContractStatus.AWAITING_DELIVERY){
            return 1;
        }
        else // if(status == ContractStatus.PAYMENT_COMPLETED)
        {
            return 2;
        }
        
    }
    modifier checkValidSatus(uint status){
        require(status>=0 && status<3,"Undefined Status number");
        _;
    }
}

