pragma solidity ^0.5.1;
pragma experimental ABIEncoderV2;
 contract PaymentLog{
    
 	address payable public wallet;

 	//----------------Definitions for Contract related Payments----------------
 	struct PaymentInfo{
 		uint installmentNumber;
 		uint amountPaid;
 		uint amountDue;
 		uint paymentDate;
 	}
    struct ContractPayment{
     	string contractId;//bidding id
     	uint bidderId;
     	address sender;
     	address receiver;
     	uint amountPaid;
     	uint amountDue;
        uint instalmentsCompleted;
     	mapping(uint => PaymentInfo) paymentLog;
     }

     //identify using contractID
     mapping(string => ContractPayment) private InstalmentPaymentMap;
    mapping(string => uint )internal contractIdExists;
     // Array of Payments
     //contractid array
     string[] public AllPayments;

     //--------------------------------
     constructor()public{
       wallet=msg.sender;  
     }
    modifier onlyOwnerOfWallet(){ 		require(msg.sender==wallet,"Access Denied"); _;			}
    modifier onlyNewContract(string memory _contractId,uint _bidderId){ 
        require(contractIdExists[_contractId]==0,"Contract Already Exists"); 
        _;			
    }
    //---------------Change-------------
    modifier ifInstalmentOneExists(string memory _contractId){
        require(contractIdExists[_contractId]==1,"Contract Payment One Does not Exist"); 
        _;
    }
    modifier ifInstalmentTwoExists( string memory _contractId, uint _instalmentNumber){
        if(_instalmentNumber==1){
            require(contractIdExists[_contractId]==1,"Contract Payment One Does not Exist"); 
        }
        else if(_instalmentNumber==2){
            require(contractIdExists[_contractId]==1,"Contract Payment One Does not Exist"); 
            require(InstalmentPaymentMap[_contractId].instalmentsCompleted==2,"Installment 2 does not exists");
        }
        _;
    }

//trans.transferEth("0xa3b40bfb7a1af8608df24fef3b1e445796acb624","1",{value:100000000}).then(()=>{console.log()})
     function createPaymentEntryOne(string memory _contractId,uint _bidderId, address _sender, address  _receiver,
      uint payAmount, uint _amount) public onlyOwnerOfWallet onlyNewContract(_contractId,_bidderId) returns (bool){

     		InstalmentPaymentMap[_contractId].contractId=_contractId;
	     	InstalmentPaymentMap[_contractId].bidderId=_bidderId;
	     	InstalmentPaymentMap[_contractId].sender=_sender;
	     	InstalmentPaymentMap[_contractId].receiver=_receiver;
	     	InstalmentPaymentMap[_contractId].amountPaid=payAmount;
	     	InstalmentPaymentMap[_contractId].amountDue=_amount-payAmount;
     		InstalmentPaymentMap[_contractId].paymentLog[1]= PaymentInfo(1,payAmount,_amount-payAmount,now);
            InstalmentPaymentMap[_contractId].instalmentsCompleted=1;
            contractIdExists[_contractId]=1;
            AllPayments.push(_contractId);
     		return true;
     }
    function createPaymentEntryTwo(string memory _contractId,uint payAmount) public onlyOwnerOfWallet
    ifInstalmentOneExists(_contractId) returns (bool)
    {
            InstalmentPaymentMap[_contractId].paymentLog[2]= PaymentInfo(2,payAmount,InstalmentPaymentMap[_contractId].amountDue-payAmount,now);
            InstalmentPaymentMap[_contractId].amountPaid=InstalmentPaymentMap[_contractId].amountPaid+payAmount;
            InstalmentPaymentMap[_contractId].amountDue=InstalmentPaymentMap[_contractId].amountDue-payAmount;
            InstalmentPaymentMap[_contractId].instalmentsCompleted=2;
    }

    function getBasicPaymentDetails(string memory _contractId) public view ifInstalmentOneExists(_contractId)
    returns (string memory contractId, uint bidderId, uint amountPaid,uint amountDue,uint instalmentsCompleted)
    {
        return (_contractId,
            InstalmentPaymentMap[_contractId].bidderId,
            InstalmentPaymentMap[_contractId].amountPaid,
            InstalmentPaymentMap[_contractId].amountDue,
            InstalmentPaymentMap[_contractId].instalmentsCompleted);
    }
    function viewContractIds() public view returns(string[] memory){
        return AllPayments;
    }

    function viewContractPayment(string memory _contractId, uint _instalmentNumber) public view 
        ifInstalmentTwoExists(_contractId,_instalmentNumber)
    returns(string memory  contractId,uint bidderId,uint instalmentsCompleted, uint amountPaid,uint amountDue,uint paymentDate){
        if(_instalmentNumber==1){
            return (_contractId,
            InstalmentPaymentMap[_contractId].bidderId,
            InstalmentPaymentMap[_contractId].instalmentsCompleted,
            InstalmentPaymentMap[_contractId].paymentLog[1].amountPaid,
            InstalmentPaymentMap[_contractId].paymentLog[1].amountDue,
            InstalmentPaymentMap[_contractId].paymentLog[1].paymentDate);
        }
        else if(_instalmentNumber==2){
             return (_contractId,
            InstalmentPaymentMap[_contractId].bidderId,
            InstalmentPaymentMap[_contractId].instalmentsCompleted,
            InstalmentPaymentMap[_contractId].paymentLog[2].amountPaid,
            InstalmentPaymentMap[_contractId].paymentLog[2].amountDue,
            InstalmentPaymentMap[_contractId].paymentLog[2].paymentDate);
        }
        else{
            revert("Only 2 Instalment Allowed!");
        }
    }
     
     function transferEth(address payable receiver,uint _amount) public payable returns(bool){
         receiver.transfer(_amount);
         return true;
     }
 }
 /*
Transfer.deployed().then((res)=>{ transfer = res; })

Transfer using web3 or transferEth function and call below functions

transfer.createPaymentEntryOne("c3","1","0xa3b40bfb7a1af8608df24fef3b1e445796acb624","0x0e4844954f980d2d40c7e7b2181ecc5e5a8a9446","30","100")

transfer.getBasicPaymentDetails("c3")

transfer.viewContractPayment("c3","1")

transfer.createPaymentEntryTwo("c3","50")

transfer.viewContractPayment("c3","2")


transfer.viewContractIds()
 */