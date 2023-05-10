// tähän käsittääkseni pitäisi kehittää joku Smart contract koodi
// alla ohje

pragma solidity ^0.8.4;

contract VotingSystem {
    
    struct Candidate {
        string name;
        uint votes;
    }
    
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;
    mapping(address => bool) public voters;
    
    constructor() {
        candidatesCount = 0;
    }
    
    function addCandidate(string memory _name) public {
        require(!voters[msg.sender], "You cannot add a candidate as a voter.");
        candidates[candidatesCount] = Candidate(_name, 0);
        candidatesCount++;
    }
    
    function vote(uint _candidateId) public {
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateId < candidatesCount, "Invalid candidate ID.");
        candidates[_candidateId].votes++;
        voters[msg.sender] = true;
    }
    
    function getCandidateVotes(uint _candidateId) public view returns (uint) {
        require(_candidateId < candidatesCount, "Invalid candidate ID.");
        return candidates[_candidateId].votes;
    }
}

// OHJE

/* In this smart contract, users can add new candidates by calling the addCandidate function and passing the name of the candidate as a parameter. Each candidate is stored as a Candidate struct with a name and a vote count.

Users can also vote for a candidate by calling the vote function and passing the ID of the candidate they want to vote for. Each voter can only vote once, and their address is stored in the voters mapping to prevent multiple votes.

The getCandidateVotes function can be called to retrieve the vote count for a specific candidate.

Note that this is just an example and would need to be customized and thoroughly tested before use in a real-world voting system. */