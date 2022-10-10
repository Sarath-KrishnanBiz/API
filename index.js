const express = require('express')
const res = require('express/lib/response')
const app = express()
const port = 4000
app.use(express.json());

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "bizcloud"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");


  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get("/addition", (req, res) => {
    let a = req.body.numone;
    let b = req.body.numtwo;
    let sum = a + b;
    res.send("Result=" + sum)
  })


  app.post("/Substraction", (req, res) => {
    let a = req.body.numone;
    let b = req.body.numtwo;
    let sum = a - b;
    res.send("Sum is :" + sum)
  })


  app.get("/multiplicaton", (req, res) => {
    let a = req.body.numone;
    let b = req.body.numtwo;
    let sum = a * b;
    res.send("Sum is :" + sum)
  })


  app.get("/divison", (req, res) => {
    let a = req.body.numone;
    let b = req.body.numtwo;
    let sum = a / b;
    res.send("Sum is :" + sum)
  })

// lOGIN
  app.post("/loginapi", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let sql = "SELECT id, txtFirstName,txtEmail,txtPhonenumber FROM tblusers where txtFirstname='" + username + "' and txtPassword='" + password + "';";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(result);
      if (result == '') {
        res.send("Error : Username and password is incorrect !!")
      }
      else {
        res.send("Success" + JSON.stringify(result))
      }

    });
  });

  // SIGNUP
  app.post("/signupapi", (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let password = req.body.password;
    let repassword = req.body.repassword;

    let sql =
      "SELECT txtFirstName,txtEmail FROM tblusers where txtEmail='" + email + "'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      if ((email != "") & (firstname != "")) {
        if (result != "") {
          res.send("user already exist please login" + JSON.stringify(result));
        }
        else {
          let sqlinsert = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtPassword) values('" + firstname + "','" + lastname + "','" + email + "','" + password + "') ;";
          con.query(sqlinsert, function (err, result1) {
            if (err) throw err;
            console.log("inserted" + result1);
            res.send("New user ")
          });
        }
      } else {
        res.send("email and firstname mandatory");
      }
    });
  });

// VERIFY OTP
  app.post("/verifyotpapi", (req, res) => {
    let otp = req.body.otp;
    let email = req.body.email;
    let sql = "select id from tblusers where txtOTP='" + otp + "'and txtEmail ='"+email+"'";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + result);
      if (result == "") {
        res.send("OTP doesnt Match!");
        return res
      }
      else {
        res.send("Valid" + JSON.stringify(result));
      }

    });
  });
})


////////resend
app.post("/resendapi", (req, res) => {
  let email = req.body.email;
  let otp = req.body.otp;

  let sql = "SELECT id FROM tblusers where txtOTP='" + otp + "' and txtEmail='"+ email +"';";

  ;
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
    console.log(result);
    if (result != "") {
      res.send("verified!!!");
    }
    else  {
      res.send("resend!!!");
    }
   
  });
});

// ADDCAMPAGIN
app.post("/AddCampaign", (req, res) => {
    let Campaignname = req.body.Campaignname;
    let Producttype = req.body.Producttype;
    let Startdate = req.body.Startdate;
    let Enddate = req.body.Enddate;
    let Createdon = req.body.Createdon;
    let sqlselect = "select tc.txtCampaignName,tp.txtProducttype from tblcampaign tc join tblproducttype tp on tc.refProducttype=tp.id where tc.txtCampaignName ='" + Campaignname + "'";
    let sql = "insert into tblcampaign(txtCampaignName,refProducttype,dtStartdate,dtEnddate,dtCreatedOn) values('" + Campaignname + "','" + Producttype + "','" + Startdate + "','" + Enddate + "','" + Createdon + "');";

    con.query(sqlselect, function (err, result) {
        if (err) throw err;
        console.log("Result" + result);
        if (Campaignname !== "") {
            if (result != "") {
                res.send("Campaignname already exist" + JSON.stringify(result));
            }
            else {
                con.query(sql, function (err, result1) {
                    if (err) throw err;
                    console.log("inserted" + result1);
                    res.send("New Campaign added ")
                });

            }
         } else
            {
                res.send("Campaign Name is Mandatory")
            }

        })
})

// GETSINGLEPROFILE
app.post("/singleprofile", (req, res) => {
  let id = req.body.id;
  let sql = "select txtFirstName,txtLastName,txtEmail,txtPhonenumber,txtPassword from tblusers where id = '" + id + "';"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result !== '') {
      res.send("User Exist"+JSON.stringify(result))
      return
    }
    else {
      res.send(" User does not Exist")
      return
    }

  });
});

// INSERTSINGLEPROFILE
app.post("/insertsingleprofile", (req, res) => {
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  let dob = req.body.dob;
  let address = req.body.address;
  let password = req.body.password;
  let repassword = req.body.repassword;
  let sql = "select txtEmail from tblusers where txtEmail =  '" + email + "';"
  let sql1 = "insert into tblusers(txtFirstName,txtLastName,txtEmail,txtdob,txtAddress,txtPassword) values ('" + firstname + "','" + lastname + "','" + email + "','" + dob + "','" + address + "','" + password + "');"
  if (firstname == "") {
    res.send("Firstname is empty")
    return
  }
  if (lastname == "") {
    res.send("Lastname is empty")
    return
  }
  if (email == "") {
    res.send("Email is empty")
    return
  }
  if (dob == "") {
    res.send("Date of birth is empty")
    return
  }
  if (address == "") {
    res.send("Address is empty")
    return
  }
  if (password == "") {
    res.send("Password is empty")
    return
  }
  if (repassword == "") {
    res.send("Repassword is empty")
    return
  }
  if (password != repassword) {
    res.send("Password's do not match")
    return
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result = " + JSON.stringify(result))
    if (result != "") {
      res.send("Profile already exists!")
      return
    }
    else {
      con.query(sql1, function (err, result) {
        if (err) throw err;
        res.send("Profile Inserted!")
        console.log("New user profile details inserted")
        return
      });
    }
  });
});



// GETSINGLELEAD
app.post("/getsinglelead", (req, res) => {
  let id = req.body.id;
  let sql = "select txtFirstName,txtCompanyName,txtEmail,txtPhone,txtAddress from tblleads where id = '" + id + "';"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result !== '') {
      res.send("Lead Exist" +JSON.stringify(result))
      return
    }
    else {
      res.send(" Lead does not Exist")
      return
    }

  });
});

// UPDATESINGLEPROFILE
app.post("/updatesingleprofileapi", (req, res) => {
  let firstname = req.body.firstname;
  let email = req.body.email;
  let id = req.body.id;
  let sql = "select id,txtFirstName,txtEmail from tblusers where txtEmail= '"+email+"'";
  let sqlupdate = "update tblusers set txtEmail='"+email+"' where id='"+id+"'";
  if (firstname == "") {
    res.send("firstname is mandatory");
    return res
  }
  if (email == "") {
    res.send("email is mandatory");
    return res
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result != "") {
      res.send("already exist");
    }
  });
  con.query(sqlupdate, function (err, result) {
    if (err) throw err;
    console.log("updated" + result);
    res.send("updated")
  });

})

// INSERTSINGLELEAD
app.post("/insertsinglelead", (req, res) => {
  let firstname = req.body.firstname;
  let Companyname = req.body.Companyname;
  let email = req.body.email;
  let Phone = req.body.Phone;
  let address = req.body.address;
  let sql = "select txtEmail from tblleads where txtEmail =  '" + email + "';"
  let sql1 = "insert into tblleads(txtFirstName,txtCompanyName,txtEmail,txtPhone,txtAddress) values ('" + firstname + "','" + Companyname + "','" + email + "','" + Phone + "','" + address + "');"
  if (firstname == "") {
    res.send("Firstname is empty")
    return
  }
  if (Companyname == "") {
    res.send("Companyname is empty")
    return
  }
  if (email == "") {
    res.send("Email is empty")
    return
  }
  if (Phone == "") {
    res.send("Phone is empty")
    return
  }
  if (address == "") {
    res.send("Address is empty")
    return
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result = " + JSON.stringify(result))
    if (result != "") {
      res.send("Profile already exists!")
      return
    }
    else {
      con.query(sql1, function (err, result) {
        if (err) throw err;
        res.send("Profile Inserted!")
        console.log("New user profile details inserted")
        return
      });
    }
  });
});

// UPDATESINGLELEAD

app.post("/updatesinglelead", (req, res) => {
  let firstname = req.body.firstname;
  let email = req.body.email;
  let id = req.body.id;
  let sql = "select id,txtFirstName,txtEmail from tblleads where txtEmail= '"+email+"'";
  let sqlupdate = "update tblleads set txtEmail='"+email+"' where id='"+id+"'";
  if (firstname == "") {
    res.send("firstname is mandatory");
    return res
  }
  if (email == "") {
    res.send("email is mandatory");
    return res
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result != "") {
      res.send("already exist");
    }
  });
  con.query(sqlupdate, function (err, result) {
    if (err) throw err;
    console.log("updated" + result);
    res.send("updated")
  });

})

// GETSINGLECAMPAIGN
app.post("/getsinglecampaign", (req, res) => {
  let id = req.body.id;
  let sql = "select tblcampaign.txtCampaignName,tblproducttype.txtProducttype from tblcampaign left join tblproducttype on tblcampaign.refProducttype =tblproducttype.id where tblcampaign.id = '" + id + "';"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result !== '') {
      res.send("Campaign Exist" +JSON.stringify(result))
      return
    }
    else {
      res.send(" Campaign does not Exist")
      return
    }

  });
});

// UPDATESINGLECAMPAIGN
app.post("/updatesinglecampaign", (req, res) => {
  let campname = req.body.campname;
  let id = req.body.id;
  let sql = "select txtCampaignName from tblcampaign  where id= '" + id + "'";
  let sqlupdate = "update tblcampaign  set txtCampaignName='" + campname + "'where id='" + id + "'";
  if (campname == "") {
    res.send("campname is mandatory");
    return res
  }
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result != "") {
      console.log("exist" +result);
      res.send("already exist");
      return res
    }
  });
  con.query(sqlupdate, function (err, result) {
    if (err) throw err;
    console.log("updated" + result);
    res.send("updated")
    return res
  });
})




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

