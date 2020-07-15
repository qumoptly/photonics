$(document).ready(function() {
  $("a[href^=http]").addClass('externallink');
  $("div.bannercontent a").addClass('banner');
  $("a.externallink").click(function(event) {
    ts = new Date().toJSON().substring(0, 16); // includes minute, not seconds
    var ahref = $(this).attr("href");
    frompage = location.href;
    frompage = frompage.replace("https://www.rp-photonics.com/", "");
    frompage = frompage.replace("http://rp_photonics.local/", "");
    p = frompage.indexOf('#');
    if (p >= 0) frompage = frompage.substr(0, p);
    var gto = ahref;
    if (gto.substr(0, 1) == "/") gto = gto.substr(1);
    if ($(this).hasClass("banner"))
      return false;  // already treated by other handler
    if($(this).hasClass('bg')) // XXX
      $.get("/log_bg.php",{goto:ahref,from:frompage,ts:ts});
    else
      $.get("/log_external.php",{goto:gto,from:frompage,ts:ts});
    if ($(this).hasClass('socialbutton'))
      window.open(ahref, "Twitter", "width=600,height=400");
    else
      window.open(ahref, '_blank', 'noopener');
    return false;
  });
  $("a.bg").click(function(event) {
    ts = new Date().toJSON().substring(0, 16); // includes minute, not seconds
    var ahref = $(this).attr("href");
    frompage = location.href;
    frompage = frompage.replace("https://www.rp-photonics.com/", "");
    frompage = frompage.replace("http://rp_photonics.local/", "");
    p = frompage.indexOf('#');
    if (p >= 0) frompage = frompage.substr(0, p);
    var gto = ahref;
    if (gto.substr(0, 1) == "/") gto = gto.substr(1);
    var supplier = $(this).attr("data-supplier");
    var keyword = $(this).attr("data-keyword");
    var datalocation = $(this).attr("data-location");
    if (!keyword) keyword = '';
    if (supplier) {
      $.get("/log_supplier.php",{supplier:supplier,keyword:keyword,location:datalocation,goto:gto,from:frompage,ts:ts});
    }
  });
  $("a.banner").click(function(event) {
    ts = new Date().toJSON().substring(0, 16); // includes minute, not seconds
    ahref = $(this).attr("href");
    // Extract banner name:
    p = ahref.indexOf('?banner=');
    if (p < 0)
      p = ahref.indexOf('&banner=');
    if (p > 0) {
      banner = ahref.substr(p + 8);
      ahref = ahref.substr(0, p);
      }
    else
      banner = '';
    frompage = location.href;
    frompage = frompage.replace("https://www.rp-photonics.com/", "");
    frompage = frompage.replace("http://rp_photonics.local/", "");
    p = frompage.indexOf('#');
    if (p >= 0) frompage = frompage.substr(0, p);
    var gto = ahref;
    if (gto.substr(0, 1) == "/") gto = gto.substr(1);
    var supplier = $(this).attr("data-supplier");
    $.get("/log_banner.php",{supplier:supplier,goto:gto,from:frompage,banner:banner,ts:ts});
    if (((ahref.substr(0, 1) != '/') && (ahref.indexOf('?tour=') < 0)) || ($(this).attr("target") == "_blank"))
      window.open(ahref);
    else
      window.location = ahref;
    return false;
  });
  $("a.enc").attr("title", "encyclopedia article on that type of product");
  $("a.suppliers").attr("title", "list of suppliers for that product");
  $("span.more").css('display','none');
  $("span.more_d").css('display','none');
  a = $('<a href="">More ...</a>');
  $("span.more").before(a.click(function() { $(this).next().css('display','inline'); $(this).remove(); return false; }));
  a = $('<a href="">Mehr Details ...</a>');
  $("span.more_d").before(a.click(function() { $(this).next().css('display','inline'); $(this).remove(); return false; }));
  $("div.show_more").css('display','block');
  $("div.show_more").next().css('display','none');
  $("div.show_more").click(function(event) {
    $(this).css('display','none');
    $(this).next().css('display','block');
  });
});

function toggle_element(el) {
  el.toggleClass('hidden');
  var expand_message = '(more ...)';
  var expand_str = ' <span style="font-size:80%">' + expand_message + '</span>';
  if (el.hasClass('hidden'))
    el.append(expand_str);
  else {
    var s = el.text();
    s = s.substr(0, s.length - expand_message.length);
    el.text(s);
  }
  el.parent().next('div').stop('true', 'true').slideToggle('fast');
}

function hide_elements(el_class) {
  $(document).ready(function() {
    $(el_class).each(function() { toggle_element($(this)); });
  });
}

$(document).ready(function() {
  $('.togglediv').css("cursor", "pointer");
  $('.togglediv').css("display", "inline-block"); /* avoid problem with floats on the right */
  $('.togglediv').wrap('<div style="margin-top:15px"></div>').css('margin-top', '0'); /* required when using inline-block */
  $('.togglediv').click(function(){
    toggle_element($(this));
  });
});

AdjustTourBox = function () {
  if ($("div.bannercontent").hasClass("tour")) {
    if ($("aside#bannerbox").css("display") == "none")
      $("aside#bannerbox").css("display", "block");
  }
};

AdjustElements = function () {
  // banner:
  var y0, bannerbox, bannerbox2, bb_height, y_end, f, y, r, nav, nav_height, l, bl, kw;
  y0 = $("#logohead").outerHeight() + 4;
  if ($("#sponsorsbox").outerHeight()) y0 += $("#sponsorsbox").outerHeight();
  bannerbox = $("#bannerbox");
  bannerbox2 = $("#bannerbox2");
  bb_height = parseInt(bannerbox.outerHeight());
  // y_end = Math.round(0.5 * ($(window).height() - bb_height));
  y_end = $(window).height() - bb_height;
  if (y_end > 0)
    y_end = Math.round(0.5 * y_end);
  f = Math.min(1, 0.001 * $(window).scrollTop());
  y = Math.max(-1000, Math.round((1 - f) * y0 + f * y_end));
  mw = parseInt($('body').css("max-width"));
  r = 15; if ($(window).width() > mw) r += 0.5 * ($(window).width() - mw);
  nav = false;
  if ($("nav#con").length)
    nav = $("nav#con");
  else if ($("nav#soft").length)
    nav = $("nav#soft");
  if (nav) {
    y0 = $("#logohead").position().top + $("#logohead").outerHeight() + 26;
    nav_height = parseInt(nav.outerHeight());
    y_end = Math.round(0.5 * ($(window).height() - nav_height));
    y_end = 40;
    f = Math.min(1, 0.005 * $(window).scrollTop());
    y = Math.max(y_end, Math.round((1 - f) * y0 + f * y_end));
    mw = parseInt($('body').css("max-width"));
    l = 20; if ($(window).width() > mw) l += 0.5 * ($(window).width() - mw);
    nav.css({left:l, top:y});
  }
  if (bannerbox.length)
    bannerbox.css({right:r,top:y});
  if (bannerbox2.length) {
    l = 15; if ($(window).width() > mw) l += 0.5 * ($(window).width() - mw);
    bb_height = parseInt(bannerbox2.outerHeight());
    y_end = $(window).height() - bb_height;
    if (y_end > 0)
      y_end = Math.round(0.5 * y_end);
    f = Math.min(1, 0.001 * $(window).scrollTop());
    y = Math.max(-1000, Math.round((1 - f) * y0 + f * y_end));
    bannerbox2.css({left:l,top:y});
  }
  if ($('#vlibbox').length) {
    y = $("#logohead").position().top;
    if ($("#logohead").width() >= 860) y += 140; else y += 110;
    $("#vlibbox").css({right:r,top:y});
    r += 40;
    $("#other_language").css({right:r});
  }
  bl = $("main").width() + 80 - $(document).scrollLeft();
  /* $("#bannerbox").css({'left':bl, 'right':'auto'}); */
  if ($("nav#enc").length)
    $("input#articlekeyword").css({'width': ($("nav#env").width() - 4)});
  kw = Math.round($("table#bgnavtable").width() - 135);
  ShapeAreaTable();
  if ($("table#topicstable").length) ShapeTopicsTable();
  if ($("table#software_overview").length) ShapeSoftwareOverviewTable();
  if ($("table#encnavtable").length) ShapeEncNavTable();
  if ($("nav#enc").length) ShapeEncLettertable();
  if ($("nav#bg").length) {
    ShapeBGmenu();
    if ($("#productletters").length) ShapeBGLetterTable();
    if ($("#supplierletters").length) ShapeBGSupplierLetterTable();
  }
  if ($("table#bg_overview").length) ShapeBGoverviewTable();
  if ($("table#sec_navigation").length) ShapeSectionTable();
  AdjustTourBox();
};

$(window).on('load', AdjustElements);
$(window).scroll(AdjustElements);
$(window).resize(AdjustElements);

function ReArrangeTable(tableID, no_rows, no_cols) {
  var tab = $("table#" + tableID);
  var no_rows_old = $("#" + tableID + " > tbody > tr").length;
  var no_td = $("table#" + tableID + " > tbody > tr > td").length;
  var n = 0;
  var c = 0;
  var r = 0;
  if (no_rows !== no_rows_old) {
    for (r = 1; r <= no_rows; r++) {
      tab.append("<tr></tr>");
      var new_tr = $("table#" + tableID + " > tbody > tr:last");
      for (c = 1; c <= no_cols; c++)
        if (n < no_td) {
          new_tr.append($("table#" + tableID + " > tbody > tr > td:first"));
          n++;
        }
    }
    for (r = 1; r <= no_rows_old; r++)
      $("table#" + tableID + " > tbody > tr:first").remove();
    $("table#" + tableID + " > tbody > tr > td").css("width", (100 / no_cols) + "%");
  }
}

function ShapeAreaTable() {
  var no_rows_wanted = 1;
  var no_cols_wanted = 2;
  if ($("#areatable").width() < 420) {
    no_rows_wanted = 2;
    no_cols_wanted = 1;
  }
  ReArrangeTable("areatable", no_rows_wanted, no_cols_wanted);
}

function ShapeSectionTable() {
  var no_rows_wanted = 1;
  var no_cols_wanted = 4;
  if ($("main").width() < 500) {
    no_rows_wanted = 2;
    no_cols_wanted = 2;
  }
  ReArrangeTable("sec_navigation", no_rows_wanted, no_cols_wanted);
}

function ShapeTopicsTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 3;
  if ($("#main").width() < 450) {
    no_rows_wanted = 6;
    no_cols_wanted = 1;
  }
  else if ($("#main").width() < 650) {
    no_rows_wanted = 3;
    no_cols_wanted = 2;
  }
  ReArrangeTable("topicstable", no_rows_wanted, no_cols_wanted);
}

function ShapeSoftwareOverviewTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 2;
  if ($("#main").width() < 700) {
    no_rows_wanted = 4;
    no_cols_wanted = 1;
  }
  ReArrangeTable("software_overview", no_rows_wanted, no_cols_wanted);
}

function ShapeEncNavTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 4;
  if ($("nav#enc").width() < 520) {
    no_rows_wanted = 4;
    no_cols_wanted = 2;
  }
  ReArrangeTable("encnavtable", no_rows_wanted, no_cols_wanted);
  no_rows_wanted = 1;
  no_cols_wanted = 2;
  if ($("nav#enc").width() < 420) {
    no_rows_wanted = 2;
    no_cols_wanted = 1;
  }
  ReArrangeTable("encnavtable2", no_rows_wanted, no_cols_wanted);
}

function ShapeEncLettertable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 13;
  if ($("nav#enc").width() < 400) {
    no_rows_wanted = 6;
    no_cols_wanted = 5;
  }
  else if ($("nav#enc").width() < 560) {
    no_rows_wanted = 4;
    no_cols_wanted = 7;
  }
  ReArrangeTable("letters", no_rows_wanted, no_cols_wanted);
}

function ShapeBGmenu() {
  var no_rows_wanted, no_cols_wanted = 4;
  var no_td = $("table#bgnavtable > tbody > tr > td").length;
  if (no_td == 4) {
    no_rows_wanted = 1;
    no_cols_wanted = 4;
    if ($("nav#bg").width() < 440) {
      no_rows_wanted = 2;
      no_cols_wanted = 2;
    }
  }
  else {
    no_rows_wanted = 2;
    no_cols_wanted = 4;
    if ($("nav#bg").width() < 450) {
      no_rows_wanted = 4;
      no_cols_wanted = 2;
    }
  }
  ReArrangeTable("bgnavtable", no_rows_wanted, no_cols_wanted);
}

function ShapeBGLetterTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 13;
  if ($("nav#bg").width() < 400) {
    no_rows_wanted = 6;
    no_cols_wanted = 5;
  }
  else if ($("nav#bg").width() < 560) {
    no_rows_wanted = 4;
    no_cols_wanted = 7;
  }
  ReArrangeTable("productletters", no_rows_wanted, no_cols_wanted);
}

function ShapeBGSupplierLetterTable() {
  var no_rows_wanted = 2;
  var no_cols_wanted = 13;
  if ($("nav#bg").width() < 400) {
    no_rows_wanted = 6;
    no_cols_wanted = 5;
    }
  else if ($("nav#bg").width() < 560) {
    no_rows_wanted = 4;
    no_cols_wanted = 7;
    }
  ReArrangeTable("supplierletters", no_rows_wanted, no_cols_wanted);
}

function ShapeBGoverviewTable() {
  var no_rows_wanted = 1;
  var no_cols_wanted = 2;
  if ($("main").width() < 530) {
    no_rows_wanted = 2;
    no_cols_wanted = 1;
    }
  ReArrangeTable("bg_overview", no_rows_wanted, no_cols_wanted);
}

function show_feedback_form() {
  $("div#feedbackstuff").css("display","block");
  $("a#showfeedbackformlink").css("display","none");
  return false;
}

function check_feedback_form() {
  with (document.articlefeedback) {
    if (generalquality[0].checked && technicalquality[0].checked && usefulness[0].checked && readability[0].checked) {
      alert("Error: the input ''don't know'' is no rating!");
      return false;
    }
    else if ((generalquality[1].checked || technicalquality[1].checked) && (comments.value == "")) {
      alert("Please explain in the comments field the reason for your low rating and submit the rating again!");
      return false;
    }
    else return true;
  }
}

function replace_umlauts(s) {
  return s.replace(/Ä/g, 'A').replace(/Ö/g, 'O').replace(/Ü/g, 'U').replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss');
}

function replace_umlauts_e(s) {
  return s.replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue').replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
}

function htmlname(keyword) {
  var s = keyword.toLowerCase();
  s = s.replace(/<sup>|<\/sup>|<sub>|<\/sub>/g, '');
  s = s.replace(/[\+]/, '');
  s = s.replace(/[&\s-]/g, '_');
  s = s.replace(/__/g, '_');
  s = s.replace(/__/g, '_'); // in case that we start with 3 _
  s = s.replace(/&ndash;/g, '_');
  s = replace_umlauts(s);
  s = s.replace(/&eacute;/g,'e').replace(/&iacute;/g,'i');
  s = s.replace(/[,:\.]/g, '');
  return s +'.html';
}

function goto_article(keyword) {
  var p = keyword.indexOf('→');
  if (p && (p > 0)) { keyword = keyword.substr(p + 2); }
  if (availableArticles_lc.indexOf(keyword) >= 0)
    window.location = htmlname(keyword)+"?s=ak";
  else
    window.location = 'find_article.html?mask=' + keyword;
    // $("#warning_dialog").dialog("open");
}
function goto_article_click(event, ui) {
  var keyword = ui.item.value.toLowerCase();
  goto_article(keyword);
}

function mail2(imgfile, dom1, nn, dom2) {
  if (imgfile == "")
    document.write('<a href="mai'+'lto:'+nn+'&#64;'+dom1+dom2+'">'+nn+'&#64;'+dom1+dom2+'<'+'/a>');
  else
    document.write('<a href="mai'+'lto:'+nn+'&#64;'+dom1+dom2+'"><img src="img/'+imgfile+'" alt="e-mail address" /><'+'/a>');
}

function show_question_form(a_elem) {
  a_elem.parent().next().css("display", "block");
}

$(document).ready(function() {
  $("a#showfeedbackformlink").click(function() { return show_feedback_form(); });
  $("form#articlefeedback").submit(function() { return check_feedback_form(); });
  $("div#feedbackstuff").css("display","none");
  // $("*").wrapAll('<div id="completepagecontent"></div>');
  // $('body').wrap('<div id="completepagecontent"></div>');
  // $('table#areatable').wrap('<div id="completepagecontent"></div>');
  if (typeof availableArticles != 'undefined')
    $("#articlekeyword").autocomplete({source:availableArticles,select:goto_article_click});
  $('#articlekeyword').keypress(function (e) { if (e.which == 13) goto_article($('#articlekeyword').val()); });
  $("input#articlekeyword").click(function() { $("p#articlekeywordnote").css('display', 'block'); });
  // $("#warning_dialog").dialog({ autoOpen:false, modal:true,
  //   buttons: { "Ok": function() { $(this).dialog("close"); }, } });
  if (typeof(availableArticles) != 'undefined') {
    availableArticles_lc = availableArticles.slice(0);
    for (var j = 0; j < availableArticles.length; j++)
      availableArticles_lc[j] = availableArticles[j].toLowerCase().replace(/<\/?sup>/g, '');
  }
  $("p.anything_unclear a").attr("title","Is anything unclear? Tell us, so that we can improve our explanations!");
  // $("a.anything_unclear").click(show_question_form());
  $("p.anything_unclear a").click(function() { show_question_form($(this)); return false; });
  $("p.anything_unclear span").click(function() { show_question_form($(this).prev()); return false; });
});
