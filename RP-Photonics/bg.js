MaxNoFreeProducts = 100;

function htmlname_product(keyword) {
  var s = keyword.replace(/[\s-]/g,'_').toLowerCase();
  p = s.indexOf('_(');
  if (p && (p > 0)) { s = s.substr(0, p); }
  s = s.replace(/[\+]/, '');
  s = s.replace(/&ndash;/g,'_');
  s = replace_umlauts_e(s);
  s = s.replace(/&eacute;/g,'e').replace(/&iacute;/g,'i');
  s = s.replace(/[,:\.]/g, '');
  s = s.replace(/(<sup>|<\/sup>)|<sub>|<\/sub>/g, '');
  return '/bg/buy_' + htmlname(keyword);
}

function htmlname_supplier(suppliername) {
  var s = replace_umlauts_e(suppliername);
  return htmlname(s);
}

function goto_product(keyword) {
  var p = keyword.indexOf('->');
  if (p && (p > 0)) { keyword = keyword.substr(p + 3); }
  p = keyword.indexOf(' (');
  if (p && (p > 0)) { keyword = keyword.substr(0, p); }
  if (availableProducts_lc.indexOf(keyword) >= 0)
    window.location = htmlname_product(keyword)+"?s=pl";
  else
    window.location = '/bg_find_products.html?mask=' + keyword;
}
function goto_product_click(event, ui) {
  var keyword = ui.item.value.toLowerCase();
  goto_product(keyword);
}
availableProducts_lc = availableProducts.slice(0);
for (var j = 0; j < availableProducts.length; j++) {
  availableProducts_lc[j] = availableProducts[j].toLowerCase();
  p = availableProducts_lc[j].indexOf(' (');
  if (p && (p > 0)) { availableProducts_lc[j] = availableProducts_lc[j].substr(0, p); }
}
$(document).ready(function() {
  $("#productkeyword").autocomplete({source:availableProducts,select:goto_product_click});
  $('#productkeyword').keypress(function (e) { if (e.which == 13) goto_product($('#productkeyword').val()); });
  $("#warning_dialog_product").dialog({ autoOpen:false, modal:true, buttons: { "Ok": function() { $(this).dialog("close"); } } });
});

function goto_supplier(suppliername) {
  if (Suppliers.indexOf(suppliername) >= 0)
    window.location = '/bg/profiles/' + htmlname_supplier(suppliername);
  else
    window.location = '/bg_find_suppliers.html?mask=' + htmlname_supplier(suppliername).replace('.html', '');
}
function goto_supplier_click(event, ui) {
  var supplier = ui.item.value;
  goto_supplier(supplier);
}

availableProducts_lc = availableProducts.slice(0);
for (var j = 0; j < availableProducts.length; j++) {
  availableProducts_lc[j] = availableProducts[j].toLowerCase();
  p = availableProducts_lc[j].indexOf(' (');
  if (p && (p > 0)) { availableProducts_lc[j] = availableProducts_lc[j].substr(0, p); }
}
$(document).ready(function() {
  $("#productkeyword").autocomplete({source:availableProducts,select:goto_product_click});
  $('#productkeyword').keypress(function (e) { if (e.which == 13) goto_product($('#productkeyword').val()); });
  $("#supplierkeyword").autocomplete({source:Suppliers,select:goto_supplier_click});
  $('#supplierkeyword').keypress(function (e) { if (e.which == 13) goto_supplier($('#supplierkeyword').val()); });
});

function ShowOrHideDetails(CB, DivName) {
  if(CB.checked)
    document.getElementById(DivName).style.display = 'block';
  else
    document.getElementById(DivName).style.display = 'none';
 }

$(document).ready(function() {
  $("td.left, td.right").click(function(event) {
    t = $(this);
    var c = 0;
    if (t.css("background-color") == "rgb(244, 244, 244)")
      c = "rgb(255, 255, 255)";
    else
      c = "rgb(244, 244, 244)";
    t.css("background-color", c);
    t.next().css("background-color", c);
    t.next().next().css("background-color", c);
  });
});

function add_p(elem, ptext) {
  p_elem = document.createElement('p');
  p_text = document.createTextNode(ptext);
  p_elem.appendChild(p_text);
  elem.appendChild(p_elem);
}
function add_red_p(elem, ptext) {
  p_elem = document.createElement('p');
  p_text = document.createTextNode(ptext);
  p_elem.appendChild(p_text);
  p_elem.style.color = "red";
  elem.appendChild(p_elem);
  nowarnings += 1;
}
function add_bold_p(elem, ptext) {
  p_elem = document.createElement('p');
  p_text = document.createTextNode(ptext);
  bold = document.createElement("b");
  bold.appendChild(p_text);
  p_elem.appendChild(bold);
  elem.appendChild(p_elem);
}
function add_li(elem, ltext) {
  li_elem = document.createElement('li');
  li_text = document.createTextNode(ltext);
  li_elem.appendChild(li_text);
  elem.appendChild(li_elem);
}
function add_red_li(elem, ltext) {
  li_elem = document.createElement('li');
  li_text = document.createTextNode(ltext);
  li_elem.appendChild(li_text);
  li_elem.style.color = "red";
  elem.appendChild(li_elem);
  nowarnings += 1;
}

function RadioValue(rObj) {
  for (var i=0; i<rObj.length; i++) if (rObj[i].checked) return rObj[i].value;
  return false;
}

function GetFieldValue(fname) {
  if (!document.getElementsByName(fname)[0]) alert("Missing field: " + fname);
  return document.getElementsByName(fname)[0].value;
}

function CalcCost() {
  nowarnings = 0;

  costdiv = document.getElementById('CalculatedCost');
  costdiv.innerHTML = "";
  // Check the chosen ad package and the max. number of displayed products:
  adpackage = RadioValue(document.getElementsByName('adpackage')); /* "yes" or "no" */
  need_ad_package = false;

  // check the number of product entries and other details:
  noproducts = 0;
  noproductdescriptions = 0;
  formelements = document.getElementById('productsform').elements;
  for (var i = 0; i < formelements.length; i++)
    if (formelements[i].name.substr(0, 4) == "has_") {
      product = formelements[i].name.substr(4, 1000);
      if (formelements[i].checked) {
        noproducts++;
        if (GetFieldValue('des_' + product) != '')
          noproductdescriptions++;
      }
    }
  if (adpackage == "yes") {
    if (GetFieldValue("company_address").indexOf("United States") > 0) {
      CostUnits = "USD";
      BasePrice = BasePrice_USD;
      ProductPrice_up_to_50 = ProductPrice_up_to_50_USD;
      ProductPrice_over_50 = ProductPrice_over_50_USD;
    }
    else {
      CostUnits = "EUR";
      BasePrice = BasePrice_EUR;
      ProductPrice_up_to_50 = ProductPrice_up_to_50_EUR;
      ProductPrice_over_50 = ProductPrice_over_50_EUR;
    }
    totalcost = BasePrice + ProductPrice_up_to_50 * Math.min(50, noproducts);
    if (noproducts > 50)
      totalcost += ProductPrice_over_50 * (noproducts - 50);
  }
  else
    totalcost = 0;
  if (adpackage == "yes") {
    add_bold_p(costdiv, 'Cost of your advertising package: ' + totalcost + ' ' + CostUnits + ' per year');
    add_p(costdiv, 'We will do our best to provide with a high advertising value and diligent service, hoping that you will be a very satisfied customer for many years.');
    add_p(costdiv, 'For new customers, we also offer a trial for 3 or 6 months, costing just a quarter or half the amount of one year, respectively. Besides, there is a 25% rebate for startup companies. Just mention that in the comments field below.');
    add_p(costdiv, 'In the form, you have registered ' + noproducts + ' products and ' + noproductdescriptions + ' product descriptions.');
    add_p(costdiv, 'Number of product images stored on our server: ' + noimages);
    if (noproducts) {
      if (noproductdescriptions < noproducts)
        add_p(costdiv, 'We will try to get any missing product descriptions from your website.');
      if (noimages < noproducts)
        add_p(costdiv, 'You can send us any images by e-mail to buyersguide@rp-photonics.com, '
          + 'or if you like we will try to find them on your website.');
    }

  }
  else {
    add_bold_p(costdiv,"No ad package has been selected, so there will be no cost.");
    add_p(costdiv, 'Your company will nevertheless appear in the supplier listings, but just as one of many suppliers – without product descriptions, images and many other extras. Note that users normally do not have the time to check the websites of all displayed suppliers; they largely concentrate on those where displayed product descriptions (through the ad package) indicate that those products may fit their needs. Also, links in those descriptions make it easy for them to get directly to the relevant page, rather than searching that location from the home page.');
    add_p(costdiv, 'Number of registered products: ' + noproducts);
    if (noproducts > MaxNoFreeProducts) {
      add_red_p(costdiv, 'Warning: you have more products than can be displayed without the ad package. ' +
        'Our system will select ' + MaxNoFreeProducts + ' of your products for display.');
        need_ad_package = true;
    }
    if (GetFieldValue("des_company").length > 1) {
       add_red_p(costdiv, 'Warning: your company description will not be displayed without the ad package!');
        need_ad_package = true;
    }
    if (GetFieldValue("quality").length > 1) {
       add_red_p(costdiv, 'Warning: your quality certificate will not be displayed without the ad package!');
        need_ad_package = true;
    }
    if (GetFieldValue("distributors").length + GetFieldValue("distributorfor").length > 2) {
       add_red_p(costdiv, 'Warning: your distributor information will not be displayed without the ad package!');
        need_ad_package = true;
    }
    if (noproductdescriptions > 0) {
       add_red_p(costdiv, 'Warning: your product descriptions will not be displayed without the ad package!');
        need_ad_package = true;
    }
    /*
    if (n_promoted > 0)
       add_red_p(costdiv, 'Warning: you cannot have promotions without the ad package!');
    */
    if (GetFieldValue('facebook_URL')
        + GetFieldValue('linkedin_URL') + GetFieldValue('twitter_URL') + GetFieldValue('youtube_URL') != "") {
       add_red_p(costdiv, 'Warning: you cannot have social media links displayed without the ad package!');
       need_ad_package = true;
    }
  }

  if(nowarnings > 0) s = "block"; else s = "none";
  $("#warningdiv").css("display", s);
}

function CheckFormInputs() {
  CalcCost();
  if (GetFieldValue("sender_name").length < 10) {
    alert("Error: Please indicate the identify of the sender!");
    return false;
  }
  else if (GetFieldValue("company_address").length < 5) {
    alert("Error: Please fill out the company address field!");
    return false;
  }
  else if ((adpackage == "yes")
          && (GetFieldValue("des_company").length < 10)) {
    alert("Error: Please fill out the company description field!");
    return false;
  }
  else if (GetFieldValue("company_URL").length < 10) {
    alert("Error: Please enter the website URL!");
    return false;
  }
  else if (GetFieldValue("spamprotection") == "") {
    alert("Error: Please fill out the spam protection field!");
    return false;
  }
  else if (need_ad_package) {
    $("#dialog-no-ap").dialog("open");
    return false;
  }
  else if (GetFieldValue("spamprotection") != "11") {
    alert("Error: Please correctly fill out the spam protection field - you entered '" + GetFieldValue("spamprotection") + "'.");
    return false;
  }
  else
    return true;
 }

 function CheckInputs() {
  if (document.getElementsByName("company")[0].value.length < 5) {
    alert("Error: Please enter the company name!");
    return false;
  }
  else if (document.getElementsByName("spamprotection")[0].value != "12") {
    alert("Error: Please fill out the spam protection field!");
    return false;
  }
  else
    return true;
}

function MakeEmail(e,s1,s2,subject,body,title) {
  if (!subject) subject = '';
  if (!body) body = '';
  if (!title) title = '';
  document.write('<a href="mai'+'lto:'+s1+'@'+s2+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body)+'" title="'+title+'">'+s1+'&#64;'+s2+'<'+'/a>');
}

function MakeEmail_prod(e,s1,s2,product,company) {
  MakeEmail(e,s1,s2,'Inquiry on ' + product, 'Dear Ladies and Gentlemen,\n\nWe learned from the RP Photonics Buyer\'s Guide that ' + company + ' offers ' + product + '.\n\nPlease send us the following information:\n\n...\n\nWith best regards\n\n','Send a product inquiry to '+company);
}

function MakeEmail_profile(e,s1,s2,company) {
  MakeEmail(e,s1,s2,'Inquiry to ' + company, 'Dear Ladies and Gentlemen,\n\nWe found ' + company + ' in the RP Photonics Buyer\'s Guide.\n\nPlease send us the following information:\n\n...\n\nWith best regards\n\n','Contact '+company);
}
