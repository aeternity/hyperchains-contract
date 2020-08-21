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


  it('Deploying Election Contract', async () => {
    contract = await client.getContractInstance(ELECTION_CONTRACT);

    const init0 = await contract.deploy([10, 5, 5]);
    assert.equal(init0.result.returnType, 'ok');

    const init1 = await contract.deploy([10, 5, 15]);
    assert.equal(init1.result.returnType, 'ok');

    const init2 = await contract.deploy([0, 0, 0]);
    assert.equal(init2.result.returnType, 'ok');
  });


  it('Deploying Election Contract – errors', async () => {
    contract = await client.getContractInstance(ELECTION_CONTRACT);

    const neg0 = await contract.deploy([-10, 5, 5]).catch(e => e);;
    assert.include(neg0.decodedError, "NEGATIVE_DEPOSIT_DELAY");

    const neg1 = await contract.deploy([10, -5, 5]).catch(e => e);
    assert.include(neg1.decodedError, "NEGATIVE_STAKE_RETRACTION_DELAY");

    const neg2 = await contract.deploy([10, 5, -5]).catch(e => e);
    assert.include(neg2.decodedError, "NEGATIVE_WITHDRAW_DELAY");

    const retract_after_withdraw = await contract.deploy([10, 15, 5]).catch(e => e);
    assert.include(retract_after_withdraw.decodedError, "STAKE_RETRACTION_AFTER_WITHDRAW");
  });
});
