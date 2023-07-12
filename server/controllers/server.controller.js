var fs = require('fs')
os = require('os')
exec = require('child_process').exec
let chainLexer = require('chain-lexer')

async function checkSyntax(string, callback){

    fs.writeFile(`${__dirname}/helper/test.cpp`, string, 'utf8', (err) => {
        if (err) console.log(err);
    });

    exec(`gcc -fsyntax-only -Werror ${__dirname}/helper/test.cpp`, function(err, stdout, stderr){
        if(err){
            // console.log(stderr)
            const error = stderr.split('error:')[1]
            callback({passed: false, error: error, res: null})
            return
        }else{
            exec(`clang -Xclang -ast-dump ${__dirname}/helper/test.cpp`, function(err, stdout, stderr){
                const res = '|-UsingDirectiveDecl' + stdout.split('|-UsingDirectiveDecl')[1]
                callback({passed: true, error: null, res: res})
            })
        }
    })
}

module.exports = {
    run: async (req, res) => {
        // console.log('OUTPUT REQUEST ....')
        let stream = req.body.input

        checkSyntax(stream, function(checkReturn){
            // console.log(checkReturn.passed)
            // console.log(checkReturn.res)
            if(checkReturn.passed){
                let lexer = chainLexer.cLexer
                lexer.start(stream)
                let outputCode = lexer.DFA.result.tokens
                let ast = checkReturn.res
                let check = 'good'
                res.status(200).send({check, outputCode, ast})
            }else{
                res.status(200).send({check: 'bad', outputCode:[{'type':'Syntax Error', 'value':checkReturn.error}], ast: 'null'})
            }
        })

    }
}