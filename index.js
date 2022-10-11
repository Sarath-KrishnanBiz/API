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
    let sql = "select id from tblusers where txtOTP='" + otp + "'and txtEmail ='" + email + "'";
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

  let sql = "SELECT id FROM tblusers where txtOTP='" + otp + "' and txtEmail='" + email + "';";

  ;
  con.query(sql, function (err, result) {
    console.log(result);
    if (err) throw err;
    console.log(result);
    if (result != "") {
      res.send("verified!!!");
    }
    else {
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
    } else {
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
      res.send("User Exist" + JSON.stringify(result))
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
      res.send("Lead Exist" + JSON.stringify(result))
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
  let sql = "select id,txtFirstName,txtEmail from tblusers where txtEmail= '" + email + "'";
  let sqlupdate = "update tblusers set txtEmail='" + email + "' where id='" + id + "'";
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
  let sql = "select id,txtFirstName,txtEmail from tblleads where txtEmail= '" + email + "'";
  let sqlupdate = "update tblleads set txtEmail='" + email + "' where id='" + id + "'";
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
  let sql = "select tblcampaign.txtCampaignName,tblproducttype.txtProducttype from tblcampaign  join tblproducttype on tblcampaign.refProducttype =tblproducttype.id where tblcampaign.id = '" + id + "';"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result !== '') {
      res.send("Campaign Exist" + JSON.stringify(result))
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
      console.log("exist" + result);
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


// GETSINGLETASK

app.post("/getsingletask", (req, res) => {
  let id = req.body.id;
  let sql = "select tt.txtActivitytype,tc.txtConversionType from tblactivity ta join tblactivitytype tt on ta.refActivitytype=tt.id join tblconversiontype tc on ta.refConversionStatus=tc.id where ta.id = '" + id + "';"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    if (result !== '') {
      res.send("Task Exist" + JSON.stringify(result))
      return
    }
    else {
      res.send(" Task does not Exist")
      return
    }

  });
});


// INSERTSINGLETASK
app.post("/insertsingletask", (req, res) => {
  let Activityname = req.body.Activityname;
  let Startdate = req.body.Startdate;
  let Enddate = req.body.Enddate;
  let sql = "select ta.txtActvityname,ta.dtCreatedOn,ta.refProgressStatus,tp.txtProgresstype,tc.txtCampaignName,tl.txtEmail from tblactivity ta  join tblprogresstype tp on ta.refProgressStatus=tp.id join tblleadcampaignmap tlc on ta.refMapid=tlc.refCampaignId join tblcampaign tc on tlc.refCampaignId=tc.id join tblleads tl on tlc.refLeadId=tl.id where ta.txtActvityname =  '" + Activityname + "';"
  let sql1 = "insert into tblactivity(txtActvityname,dtStartdate,DtEnddate) values ('" + Activityname + "','" + Startdate + "','" + Enddate + "');"
  if (Activityname == "") {
    res.send("Activityname is empty")
    return
  }
  // if (Companyname == "") {
  //   res.send("Companyname is empty")
  //   return
  // }
  // if (email == "") {
  //   res.send("Email is empty")
  //   return
  // }

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result = " + JSON.stringify(result))
    if (result != "") {
      res.send("Profile already exists!" + JSON.stringify(result))
      return
    }
    else {
      con.query(sql1, function (err, result1) {
        if (err) throw err;
        res.send("Profile Inserted!" + JSON.stringify(result1))
        console.log("New user profile details inserted")
        return
      });
    }
  });
});


// UPDATESINGLETASK

// SALEPERSONSUCCESSRATE
app.post('/SalespersonwiseSuccessRate', (req, res) => {
  let Conversiontype = req.body.Conversiontype;
  let sql = "SELECT tm.refLeadId,tl.txtFirstName,tc.txtConversionType,COUNT(txtFirstName) FROM tblleads tl JOIN tblleadcampaignmap tm ON tl.id = tm.refLeadId JOIN tblactivity ta ON tm.id = ta.refMapid JOIN tblconversiontype tc ON tc.id = ta.refConversionStatus WHERE tc.txtConversionType ='" + Conversiontype + "' GROUP BY (tl.txtFirstName);"
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
    res.send(result)
  })
})

// CAMPAIGNWISEPROSPECTCOUNT

app.post('/campaignwiseprospectcountapi', (req, res) => {
  let Conversiontype = req.body.Conversiontype;
  let sql = "SELECT B.refCampaignId,A.txtCampaignName,D.txtConversionType,COUNT(txtCampaignName) AS count FROM tblcampaign A JOIN tblleadcampaignmap B ON A.id = B.refCampaignId JOIN tblactivity C ON B.id = C.refMapid JOIN tblconversiontype D ON C.refConversionStatus = D.id where D.txtConversionType = '" + Conversiontype + "'GROUP BY A.txtCampaignName;"
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
    res.send(result)
  });
});


// LEADSFUNNEL
app.post('/leadsfunnel', (req, res) => {
  // let Conversiontype = req.body.Conversiontype;
  let sql = "select count(id) leadscount from tblleads union all SELECT count(d.txtConversionType) as NoOfLeads FROM tblleads a JOIN tblleadcampaignmap b ON a.id = b.refLeadId JOIN tblactivity c ON b.id = c.refMapid JOIN tblconversiontype d ON c.refConversionStatus = d.id where d.txtConversionType = 'New' or d.txtConversionType = 'Working' group by d.txtConversionType"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result)
    res.send(result)
  });
});

// MANAGERPROSPECTCOUNT  NO OUTPUT

app.post("/Managerwiseprospectcount", (req, res) => {
  let sql = "SELECT A.txtJobTitle Jobtitle, B.txtFirstName Name, count(E.txtConversionType) as Count FROM tbljobtitle A JOIN tblusers B ON A.id = B.refJobTitle JOIN tblleadcampaignmap C ON C.refCreatedBy = B.id JOIN   tblactivity D ON D.refMapid = C.id JOIN tblconversiontype E on E.id= D.refConversionStatus where txtJobTitle='%Manager%';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// PROSPECTGROWTH

app.post('/prospectGrowth', (req, res) => {
  let sql = "SELECT d.txtConversionType, COUNT(d.txtConversionType) as count FROM tblleads a JOIN tblleadcampaignmap b ON a.id = b.refLeadId JOIN tblactivity c ON b.id = c.refMapid JOIN tblconversiontype d ON c.refConversionStatus = d.id WHERE d.txtConversionType = 'Prospect';"
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
    res.send(result)
  });
});

// PROSPECTPROGRESS

app.post('/prospectProgress', (req, res) => {
  let sql = "SELECT tct.txtconversiontype, tpt.txtProgresstype FROM tblactivity ta JOIN tblconversiontype tct ON ta.refConversionStatus = tct.id    JOIN tblprogresstype tpt ON ta.refProgressStatus = tpt.id WHERE tct.txtconversiontype = 'Prospect';"
  con.query(sql, function (err, result) {
    if (err) throw err
    console.log(result)
    res.send(result)
  });
});

// GETUSERLISTFILTER

app.post("/GetUserListWithFilter", (req, res) => {
  let username = req.body.username;
  let name = req.body.name;

  let sql = "select * from tblusers where txtFirstName= '" + username + "';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);

    if (username != "" || name != "") {
      if (username != "" & name == "") {
        if (result != "") {
          res.send("success" + JSON.stringify(result));
        }
        else {
          res.send("error");
        }
      }
      if (username == "" & name != "") {
        let sql1 = "select * from tblusers where txtFirstName like '" + name + "';";
        con.query(sql1, function (err, result1) {
          if (err) throw err;
          console.log("Result: " + result1);
          if (result1 != "") {
            res.send("success" + JSON.stringify(result1));
          }
          else {
            res.send("error");
          }
        });

      }
      if
        (username != "" & name != "") {
        res.send("please use username or name");
      }


    }
    else {
      res.send("username or name is mandatory ");
    }

  });
});



app.post("/GetLeadListWithFilter", (req, res) => {
  let username = req.body.username;
  let name = req.body.name;

  let sql = "select * from tblleads where txtFirstName= '" + username + "';";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + result);

    if (username != "" || name != "") {
      if (username != "" & name == "") {
        if (result != "") {
          res.send("success" + JSON.stringify(result));
        }
        else {
          res.send("error");
        }
      }
      if (username == "" & name != "") {
        let sql1 = "select * from tblleads where txtFirstName like '" + name + "';";
        con.query(sql1, function (err, result1) {
          if (err) throw err;
          console.log("Result: " + result1);
          if (result1 != "") {
            res.send("success" + JSON.stringify(result1));
          }
          else {
            res.send("error");
          }
        });

      }
      if (username != "" & name != "") {
        res.send("please use username or name");
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

