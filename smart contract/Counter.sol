// tähän käsittääkseni pitäisi kehittää joku Smart contract koodi

pragma solidity ^0.8.0;

contract Counter {
    uint256 private count;

    function increment() public {
        count += 1;
    }

    function getCount() public view returns (uint256) {
        return count;
    }
}
