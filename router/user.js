const con =require("../db/conn")
const express = require("express")
const bcrypt=require("bcryptjs")
const uuid = require('uuid')
const userMiddleware = require('../middleware/auth');
const jwt = require("jsonwebtoken")
const router = express.Router();
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("../middleware/token");

router.post('/sign-up', userMiddleware.validateRegister, (req, res, next) => {
    console.log(req.body,45)
    con.query(
      `SELECT * FROM user WHERE LOWER(username) = LOWER(${con.escape(
        req.body.username
      )});`,
      (err, result) => {
        if (result.length) {
          return res.status(409).send({
            msg: 'This username is already in use!'
          });
        } else {
          // username is available
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).send({
                msg: err
              });
            } else {
              // has hashed pw => add to database
              con.query(
                `INSERT INTO user(UserId,username, password) VALUES ('${uuid.v4()}', ${con.escape(
                  req.body.username
                )}, ${con.escape(hash)})`,
                (err, result) => {
                  if (err) {
                    throw err;
                    return res.status(400).send({
                      msg: err
                    });
                  }
                  return res.status(201).send({
                    msg: 'Registered!'
                  });
                }
              );
            }
          });
        }
      }
    );
  });


  // routes/router.js

router.post('/login', (req, res, next) => {
    con.query(
      `SELECT * FROM user WHERE username = ${con.escape(req.body.username)};`,
      (err, result) => {
        console.log(result.length);
        // user does not exists
        if (!result.length) {
         
          return res.status(400).send({
            msg: "username not exit"
          });
        }
  
  
        // check password
        bcrypt.compare(
          req.body.password,
          result[0]['password'],
          (bErr, bResult) => {
            // wrong password
            if (bErr) {
              return res.status(401).send({
                msg: 'Username or password is!'
              });
            }
  
            if (bResult) {
                const accessToken = jwt.sign(
                    {
                      id: result[0].UserID,
                    },
                    process.env.JWT_SEC,
                    { expiresIn: "3d" }
                  );
              
  
              res.status(200).send({ username: result[0].username,
                userId: result[0].UserID,
                token:accessToken
            })
              
            }
            else{
                res.status(200).send({message:"username or password does not match"})
            }
            
          }
        );
      }
    );
  });

  router.put('/update', verifyToken,userMiddleware.validateUpdate,(req, res, next) => {
    con.query(
      `SELECT * FROM user WHERE UserId = ${con.escape(req.user.id)};`,
      (err, result) => {
      //  console.log(result.length);
        // user does not exists
        if (!result.length) {
         
          return res.status(400).send({
            msg: "username not exit"
          });
        }
        else
        {
            bcrypt.compare(
                req.body.oldPassword,
                result[0]['password'],
                (bErr, bResult) => {
                    console.log(bResult)
                  // wrong password
                  if (!bResult) {
                    return res.status(401).send({
                      msg: 'plese enter valid old password!'
                    });
                  }
                  else
                  {
                       bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                    if (err) {
                      return res.status(500).send({
                        msg: err
                      });
                    }
                    else
                    {
                        
                        //let sql=`UPDATE user SET password=${con.escape(hash)} where UserID=${result[0]['UserID']}`
                        
                        con.query(
                            `UPDATE user SET password=${con.escape(hash)} where UserID="${result[0]['UserID']}"`,
                            (err, result) => {
                              if (err) {
                                throw err;
                                return res.status(400).send({
                                  msg: "Passwoed not change"
                                });
                              }
                              return res.status(201).send({
                                msg: 'Password changed'
                              });
                        }
                     );
                    }
                })                  
            }
          })
        }
    })
  });


router.delete("/delete",verifyToken,(req, res, next)=>{
    con.query(
        `DELETE FROM user WHERE UserID = ${con.escape(req.user.id)};`,
        (err, result) => {
        //  console.log(result.length);
          // user does not exists
          if (!result) {
           
            return res.status(400).send({
              msg: "user not exit"
            });
          }
          else
          {
              res.status(200).send({message:"user delete successfully"})
          }
        })
})

router.get("/",verifyToken,(req, res, next)=>{
    con.query(
        `SELECT * FROM user WHERE UserID = ${con.escape(req.user.id)}`,
        (err, result) => {
        //  console.log(result.length);
          // user does not exists
          if (!result.length ){
           
            return res.status(400).send({
              msg: "user  not found"
            });
          }
          else
          {
            res.status(200).send({user: result})
          }
          
        })

    })


router.get("/allusers",verifyToken,(req, res, next)=>{
    con.query(
        `SELECT * FROM user;`,
        (err, result) => {
        //  console.log(result.length);
          // user does not exists
          if (!result.length) {
           
            return res.status(400).send({
              msg: "list  not found"
            });
          }
          else
          {
            res.status(200).send({user: result})
          }
          
        })

    })

router.post("/calculation",verifyToken,(req, res, next)=>{
    let num=[]
    for(let i=0;i<req.body.num.length;i++){
        num.push(req.body.num[i])
    }
     num.sort();
     console.log(`max number is ${num[num.length-1]}`)
     console.log(`min number is ${num[0]}`)
     let sum =0;
     for(let i=0;i<num.length;i++)
     {
       sum +=num[i]
     }
     let avg=sum/num.length
     console.log(`avergae is ${avg}`)
    res.status(200).send({message:"all is well"})


})
 

  module.exports=router;