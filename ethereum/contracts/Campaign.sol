pragma solidity ^0.4.17;

// contract that creates of Campaigns contracts.
// For security, we can't allow the user to create a Campaign contract, because he could modify the bytecode and inject malicious actions, like paying himself.
contract CampaignFactory {
    // this contract also gives us access to all Campaigns, saved in an array.

    address[] public deployedCampaigns;

    // no constructor

    // creates a campaign contract, and saves it in the campaigns array.
    function createCampaign(uint256 minimum) public {
        address theManager = msg.sender;
        address newCampaign = new Campaign(minimum, theManager); // the sender is the contract, but we need to assign the manager to the creator of the contract
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

/**
    Everytime I modify this code, run node compile.js to compile it, and node deploy.js to deploy and grab the address.
    You can test it first in remix before doing all that.
 */
contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals; // people who have approved the request
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    // modifier (helper) to add in some functions where we want only the manager of the contract to call.
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    // constructor
    function Campaign(uint256 minimum, address creator) public {
        manager = creator; // we can't use msg.sender, because it's the address of the contract, not the creator.
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public restricted {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(request.approvalCount > (approversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getCampaignDetails()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        // retrieve the balance, minimum contribution,
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
