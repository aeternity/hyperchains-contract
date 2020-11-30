/*
 * ISC License (ISC)
 * Copyright (c) 2018 aeternity developers
 *
 *  Permission to use, copy, modify, and/or distribute this software for any
 *  purpose with or without fee is hereby granted, provided that the above
 *  copyright notice and this permission notice appear in all copies.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
 *  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
 *  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
 *  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
 *  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
 *  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *  PERFORMANCE OF THIS SOFTWARE.
 */

const { Universal, MemoryAccount, Node } = require('@aeternity/aepp-sdk');

const ELECTION_CONTRACT = utils.readFileRelative(
  './contracts/Election.aes',
  'utf-8',
);

const config = {
  url: 'http://localhost:3001/',
  internalUrl: 'http://localhost:3001/',
  compilerUrl: 'http://localhost:3080',
};

describe('Election Contract', () => {
  let client, contract;

  before(async () => {
    client = await Universal({
      nodes: [
        {
          name: 'devnetNode',
          instance: await Node(config),
        },
      ],
      accounts: [
        MemoryAccount({
          keypair: wallets[0],
        }),
      ],
      networkId: 'ae_devnet',
      compilerUrl: config.compilerUrl,
    });
  });
  
  beforeEach(async () => {
    contract = await client.getContractInstance(ELECTION_CONTRACT);
    const init = await contract.deploy([{ 
      deposit_delay          : 2,
      stake_retraction_delay : 2,
      withdraw_delay         : 4,
      restricted_address     : undefined
    }]);
    assert.equal(init.result.returnType, 'ok');
  });

  // it('Deploying Election Contract', async () => {
  //   const init1 = await contract.deploy([{
  //     deposit_delay          : 0,
  //     stake_retraction_delay : 0,
  //     withdraw_delay         : 0,
  //     restricted_address     : undefined
  //   }]);
  //   assert.equal(init1.result.returnType, 'ok');

  //   const init2 = await contract.deploy([{
  //     deposit_delay          : 15,
  //     stake_retraction_delay : 15,
  //     withdraw_delay         : 15,
  //     restricted_address     : undefined
  //   }]);
  //   assert.equal(init2.result.returnType, 'ok');
  // });


  // it('Deploying Election Contract – errors', async () => {
  //   const neg0 = await contract.deploy([{
  //     deposit_delay          : -5,
  //     stake_retraction_delay : 5,
  //     withdraw_delay         : 5,
  //     restricted_address     : undefined
  //   }]).catch(e => e);
  //   assert.include(neg0.decodedError, "NEGATIVE_DEPOSIT_DELAY");

  //   const neg1 = await contract.deploy([{
  //     deposit_delay          : 5,
  //     stake_retraction_delay : -5,
  //     withdraw_delay         : 5,
  //     restricted_address     : undefined
  //   }]).catch(e => e);
  //   assert.include(neg1.decodedError, "NEGATIVE_STAKE_RETRACTION_DELAY");

  //   const neg2 = await contract.deploy([{
  //     deposit_delay          : 5,
  //     stake_retraction_delay : 5,
  //     withdraw_delay         : -5,
  //     restricted_address     : undefined
  //   }]).catch(e => e);
  //   assert.include(neg2.decodedError, "NEGATIVE_WITHDRAW_DELAY");

  //   const retract_after_withdraw = await contract.deploy([{
  //     deposit_delay          : 5,
  //     stake_retraction_delay : 6,
  //     withdraw_delay         : 5,
  //     restricted_address     : undefined
  //   }]).catch(e => e);
  //   assert.include(retract_after_withdraw.decodedError, "STAKE_RETRACTION_AFTER_WITHDRAW");
  // });

  it('block_h test', async () => {
    
    const h1 = await contract.methods.bh()
    const h2 = await contract.methods.bh()
    const h3 = await contract.methods.bh()
    assert.equal([h1.decodedResult, h2.decodedResult, h3.decodedResult], [])
  })

  it('Deposit and withdraw', async () => {
    const deposit = await contract.methods.deposit_stake({amount: 1000})
    assert.equal(deposit.result.returnType, 'ok');
    const with_req = await contract.methods.request_withdraw(1000)
    assert.equal(with_req.result.returnType, 'ok');
    const with_0 = await contract.methods.withdraw();
    assert.equal(with_0.decodedResult, 0);
    const with_1 = await contract.methods.withdraw();
    assert.equal(with_1.decodedResult, 1000);
    const with_2 = await contract.methods.withdraw();
    assert.equal(with_2.decodedResult, 0);
  })

  // it('')
});
