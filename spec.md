**1. System Overview:**

* **Smart Contract:** Acts as an escrow account, holding the funds.
* **Web App:** User interface.
* **Relayer Server:** Third-party service facilitating communication between the web app and the smart contract.
* **Relayer Contract:** Third-party smart contract bridging the gap between the relayer server and the main DApp contract.

**2. Smart Contract Functionality:**

* **State Variables:**
    * `admin`: Address of the contract administrator.
    * `relayer`: Address of the realyer smart contract.
    * `paused`: Boolean flag indicating if the contract is paused.
    * `distribution_amount`: Fixed amount users can receive.
    * `distributed_to_addr`: Mapping to track addresses that have already received funds
    * `distributed_to_acc`: Mapping to track GitHub accounts that have already received funds
* **Functions:**
    * `init(admin: Address, realyer: Address, distribution_amount: U512)`: Initializes the contract.
    * `distribute(user_addr: Address, github_acc: String)`: Distributes funds to a user if eligible.
    * `pause()`: Pauses the contract, preventing distributions.
    * `unpause()`: Resumes the contract, allowing distributions.

**3. Web App Functionality:**

* **Login:** Allows users to connect their crypto wallet.
* **Input:** Users provide their GitHub username.
* **GitHub API Call:** Web app verifies the existence of the provided GitHub account using the official API.
* **Deployment Request:** Web app generates a transaction object containing:
    * User address.
    * Verified GitHub username.
    * The escorw smart contract address.
* **Relayer Server Interaction:** Web app sends the transaction object to the relayer server.

**4. Relayer Server and Contract Interaction:**

* **Relayer Server:**
    * Receives the transaction object from the web app.
    * Forwards the transaction object to the relayer contract.
* **Relayer Contract:**
    * Calls the `distribute` function of the main DApp contract, providing user address and verified GitHub username.