app.post("/updatesinglecampaign", (req, res) => {
  let campname = req.body.campname;
  let Producttype = req.body.Producttype;
  let id = req.body.id;
  let sql = "select tblcampaign.txtCampaignName,tblproducttype.txtProducttype from tblcampaign join tblproducttype on tblcampaign.refProducttype=tblproducttype.id where tblcampaign.id= '" + id + "'";
  let sqlupdate = "update tblcampaign join tblproducttype on tblcampaign.refProducttype=tblproducttype.id  set tblcampaign.txtCampaignName='" + campname + "','"+Producttype+"'where tblcampaign.id='" + id + "'";
  if (campname == "") {
    res.send("campname is mandatory");
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