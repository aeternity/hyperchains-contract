Hyperchains Contract
====================

Proxy lib for the AEternity project. When used as a dependency, provides compiled and ready to use StakingContract.json

The source code (in Sophia programming language) for the contract is in `/priv/SimpleElection.aes`

The contract can be included in a rebar project or built and tested as described in "Develop locally" section of this README.

Build
-----

In a basic case there is no need to build it specifically, just dep it in the `rebar.config`:

`{deps, [{hyperchains_contract, {git, "git://github.com/aeternity/hyperchains-contract.git",}}]}`

Make sure NOT to use `ref` or `tag` tuple (as it will be updated in due time).

The contract compilation target is `/data/aehyperchains/StakingContract.json`, so make sure the dir exists.

Globally registered `rebar3` used; if a project defined one is preferred (which generally is not a good idea), change the `{compile, "rebar3 ...` line in `rebar.config` to `{compile, "./rebar3 ...`

Develop locally
---------------

Dependencies:
- Docker
- aeproject: `npm install -g aeproject`

```sh
# start environment
$ aeproject env

# compile contract
$ aeproject compile

# run tests
$ aeproject test
```
