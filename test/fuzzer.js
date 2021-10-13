var fuzzer = require('ot-fuzzer');
var OTTypeSlate = require('../dist');

export function generateRandomOp(snapshot) {
    
}

describe('fuzzer', function () {
    it('random operations', function () {
        expect(function () {
            fuzzer(OTTypeSlate.type, generateRandomOp, 100);
        }).to.not.throw(Error);
    });
});