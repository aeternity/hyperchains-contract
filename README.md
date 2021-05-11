Hyperchains Contract
====================

Proxy lib for the AEternity project. When used as a dependency, provides compiled and ready to use `StakingContract.json`

The source code (in [Sophia programming language](https://github.com/aeternity/aesophia/blob/lima/docs/sophia.md)) for the contract is in [/contracts/Election.aes](contracts/Election.aes)

The contract can be included in a rebar project (as described in section A of this README) or built and tested manually (section B).

Usage
-----

There are two ways to use the contract provided.

### A. Automatic building as a rebar3 dependency

In a basic case there is no need to build it specifically, just dep it in the `rebar.config`:

`{deps, [{hyperchains_contract, {git, "git://github.com/aeternity/hyperchains-contract.git",}}]}`

Make sure NOT to use `ref` or `tag` tuple (as it will be updated in due time).

The contract compilation target is `/data/aehyperchains/StakingContract.json`, so make sure the dir exists.

Globally registered `rebar3` used; if a project defined one is preferred (which generally is not a good idea), change the `{compile, "rebar3 ...` line in `rebar.config` to `{compile, "./rebar3 ...`

### B. Manual building when developing locally

Dependencies:
- Docker;
- aeproject: `npm install -g aeproject`.

A typical dev cycle would go like this: 

```sh
# start environment
$ aeproject env

# compile contract
$ aeproject compile

# run tests
$ aeproject test
```
