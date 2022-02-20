import axios from "axios";

const cheerio = require("cheerio");

export default class TXBA_Utilities {
  constructor() {
    this.baseURL = "https://texasbluesalley.com/proplayer74-tony/";
    this.default_entries_slug = "--ajax-browser-default-entries";
    this.notification_slug = "--ajax-load-default-page";
    this.favorites_slug = "--ajax-load-favorites-list";
    this.filter_slug = "--ajax-browser-filters";
    this.package_slug = "--ajax-get-package-info";
    this.search_slug = "--ajax-browser-search-entries";
    this.member_loops_slug = "--ajax-get-segment-user-loops";
    this.segment_slug = "--ajax-get-segment-info";
    this.load_media_slug = "--ajax-load-media";
    this.load_vimeo_slug = "/--ajax-load-media/vimeo/";
    this.load_comments_slug = "/--ajax-load-comments/";
    this.slug_code = {
      pro_player_packages:
        "wcm9fcGxheWVyX3BhY2thZ2VzXC8iLCJjaGFubmVsIjoicHJvX3BsYXllcl9wYWNrYWdlcyJ9",
      free_lesson_friday:
        "mcmVlX2xlc3Nvbl9mcmlkYXlcLyIsImNoYW5uZWwiOiJmcmVlX2xlc3Nvbl9mcmlkYXkifQ",
      tone_tuesday: "0b25lX3R1ZXNkYXlcLyIsImNoYW5uZWwiOiJ0b25lX3R1ZXNkYXkifQ",
      performances: "wZXJmb3JtYW5jZXNcLyIsImNoYW5uZWwiOiJwZXJmb3JtYW5jZXMifQ",
      backing_tracks:
        "iYWNraW5nX3RyYWNrc1wvIiwiY2hhbm5lbCI6ImJhY2tpbmdfdHJhY2tzIn0",
      youtube_videos:
        "5b3V0dWJlX3ZpZGVvc1wvIiwiY2hhbm5lbCI6InlvdXR1YmVfdmlkZW9zIn0",
      refiner: "mcmVlX2xlc3Nvbl9mcmlkYXlcLyJ9"
    };
    //mcmVlX2xlc3Nvbl9mcmlkYXlcLyIsImNoYW5uZWwiOiJmcmVlX2xlc3Nvbl9mcmlkYXki LCJ0YWdfaWQ6NiI6Ijg2In0;

    this.favs = [];
  }

  async getAsyncData ( slug, callback, useBase = true ) {
    if ( slug ) {
      console.log(slug, callback?.name, useBase)
      const url = `${useBase ? this.baseURL : ''}${slug}`;
      return await axios
        .get( url )
        .then( async response => await response.data )
        .then( data => ( callback ? callback.call( this, data ) : data ) )
        .catch( err => {
          // console.log(err);
          return err;
        } );
    }
    return null
  }

  async postAsyncData(params) {
    return axios({
      method: "post",
      url: "https://texasbluesalley.com/",
      data: new URLSearchParams(params),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
      .then(response => {
        // console.log("response", response);
        return response;
      })
      .catch(function(response) {
        console.log(response);
        return response;
      });
  }
  async getFavs(id) {
    let url = `${this.favorites_slug}/${id ? id : ""}`
    return this.getAsyncData(url, this.parseFavoriteHtml);
  }

  getNotification() {
    return this.getAsyncData(
      this.notification_slug,
      this.parseNotificationHtml
    );
  }

  getMemberLoops(segID) {
    return this.getAsyncData(`${this.member_loops_slug}/${segID}`);
  }

  getUserSegment(segID) {
    return this.getAsyncData(`${this.segment_slug}/${segID}`);
  }

  async getDefaultSearchEntries() {
    return this.getAsyncData(
      this.default_entries_slug,
      this.parseSearchResults
    );
  }

  async getSearchEntries(category, auth, url) {
    category = category === "courses" ? "pro_player_packages" : category;
    let endOfAuthString = "nRyaWVzXC9";
    let trimPoint =
      -1 *
      (auth.length - (auth.indexOf(endOfAuthString) + endOfAuthString.length));
    auth = auth.slice(0, trimPoint);
    let slug = url
      ? url
      : `${this.search_slug}/${category}/${auth}${this.slug_code[category]}`;
    return this.getAsyncData(slug).then(data => this.parseSearchResults(data));
  }
  async getSearchFiltersByCategory(code) {
    return this.getAsyncData(`${this.filter_slug}/${code}`, this.parseCriteria);
  }

  async getPackage(ID) {
    // console.log('id', ID)
    if (!ID) return ID;
    const response = await axios.get(
      `${this.baseURL}${this.package_slug}/${ID}`
    );
    let pkg = await await response.data;
    pkg.playSections = this.parseSections(pkg.sections, pkg.packageImage);
    // console.log("pack", pkg);
    return pkg;
  }

  async getSegment(ID) {
    let slug = `${this.segment_slug}/${ID}`;
    // console.log('getSeg', slug)
    return this.getAsyncData(slug);
  }

  async getComments(packageID, segmentID) {
    const slug = `${this.load_comments_slug}/?package_id=${packageID}&segment_id=${segmentID}&author=no`;
    return this.getAsyncData(slug, this.parseCommentHtml);
    return this.parseCommentHtml(this.getCommentString(1));
  }

  async loadMedia(slug, info) {
    const html = await this.getAsyncData(`${slug}`);
    const $ = cheerio.load(html);
    const text = $("script").html();
    // return html
    const matchX = text.match(/var videoData = (.*);/);
    if (!matchX) return info;
    let strVidData = matchX[1];
    // replace single with double quotes
    strVidData = strVidData.replace(/'/g, '"');
    //match any variables (alphanumeric) that end with a colon :, but will ingore any matches that are found between quotes (i.e. data string values)
    strVidData = strVidData.replace(/([^"]+)|("[^"]+")/g, function($0, $1, $2) {
      if ($1) {
        // Replace property names with quotes
        return $1.replace(/([a-zA-Z0-9]+?):/g, '"$1":');
      } else {
        return $2;
      }
    });
    strVidData = strVidData.replace("},]", "}]");
    // console.dir("loadingMedia", JSON.parse(strVidData), info);
    var objReturn = JSON.parse(strVidData);
    // if (typeof(info.data) !== 'undefined') objReturn = Object.assign({}, info, objReturn, info)
    return objReturn;
  }
  parseCommentHtml(strComments, lvl = null) {
    const $ = cheerio.load(strComments);
    // console.log("cHTML", $("body").html());
    lvl = $(".cmts-list > #no-questions").length > 0;
    var objComment = this.parseComments(strComments);
    console.log("aft parse", objComment);
    return objComment.list ? objComment : strComments;
  }

  parseComments(str) {
    const $ = cheerio.load(str, {
      withDomLvl1: true,
      normalizeWhitespace: true
    });
    var lvl = 0;
    var self = this;
    var list = [];

    var notice = $("strong").html() || "NO SCREENNAME";
    if ($("#no-questions").length === 0) {
      // console.log("objlist", objList);
      // loop all levels
      do {
        var objList = $(`.level-${lvl} > .cmt-inner`);
        console.log("generating level-" + lvl);
        objList.each(function(idx, itm) {
          list = self.assembleCommentObject($(itm), list);
          // console.log(lvl, idx, $($(itm).closest("li")).html());
        });
        lvl++;
        // console.log("testing level-" + lvl);
        var next = $(`.level-${lvl} > .cmt-inner`).length > 0;
        // var next = lvl > -1;
        // console.log("next", next, lvl);
      } while (next);
    }

    return {
      notice: notice,
      // list: list
      // list: this.groupByReplyDate(list, "day")
      list: this.groupArrayOfObjects(list, "day")
    };
  }

  groupByReplyDate(list) {
    for (var i = 0; list.length; i++) {
      list[i].children.sort(function(a, b) {
        return a.date - b.date;
      });
    }
    return list;
  }
  assembleCommentObject(itm, list) {
    const $ = cheerio;
    // get parent data info
    var objItm = Object.assign(
      {},
      $(itm)
        .closest(".cmt-wrapper")
        .data()
    );
    objItm.epoch = objItm.date;
    objItm.children = [];
    const dateFmts = this.getDateFormats(objItm.epoch);
    objItm.text = [
      $(itm)
        .find(".cmt-text")
        .text()
        .trim()
        .replace(/\s{2,40}/g, " ")
    ];
    objItm.user = $(itm)
      .find(".author-name")
      .text()
      .trim();
    // .replace(/\s{2,40}/g, " ");
    objItm.relativeDate = $(itm)
      .find(".cmt-date")
      .text()
      .trim();
    // .replace(/\s{2,40}/g, " ");
    objItm.date = dateFmts.date;
    objItm.day = dateFmts.day;
    objItm.time = dateFmts.time;
    // console.log("lvl", objItm.level);
    if (objItm.level > 0) {
      // find parent and add to parent's children
      const found = list.find(o => o.commentId === objItm.parentId);
      found.children.push(objItm);
      // console.log(`parent found`, found);
    } else {
      list.push(objItm);
    }
    return list;
  }
  parseSections(sections, poster) {
    const newSections = [];
    sections.forEach(section => {
      // remove unnecessary segment entries (= "")
      const testSegments = section.segments.map(segment => {
        return Object.entries(segment).reduce((relevant, [k, v]) => {
          if (v !== "") relevant[k] = v;
          return relevant;
        }, {});
      });

      // filter segs without Filename or Code in the keys
      const segments = testSegments.filter(segment =>
        Object.keys(segment).some(function(k) {
          return ~k.indexOf("Filename") || ~k.indexOf("Code");
        })
      );
      const newSection = {
        sectionTitle: section.sectionTitle,
        sectionID: section.sectionID,
        segments: segments.map(seg => {
          let segData = this.parseSegmentData(seg);
          let tmp = {
            title: seg.segmentTitle,
            id: seg.segmentID,
            poster: poster
          };
          let whole = Object.assign({}, tmp, segData);
          // console.log('compare', tmp, whole)
          return whole;
        })
      };

      newSections.push(newSection);
    });
    return newSections;
  }
  parseSegmentData(seg) {
    let type = {};
    if (this.objectHaveKeyLike(seg, "Vimeo"))
      type = {
        "webkit-playsinline": true,
        playsinline: true,
        allowfullscreen: true,
        type: "vimeo",
        sources: [
          {
            type: "vimeo",
            src: seg.segmentVimeoCode
          }
        ],
        color: "accent"
      };
    if (this.objectHaveKeyLike(seg, "YouTube"))
      type = {
        sources: [
          {
            type: "video/youtube",
            src: seg.segmentYouTubeCode //&html5=true`,
          }
        ],
        type: "youtube",
        "webkit-playsinline": true,
        playsinline: true,
        preload: "none",
        color: "red"
      };
    if (this.objectHaveKeyLike(seg, "MP3"))
      type = {
        controls: true,
        type: "audio",
        playsinline: true,
        sources: [
          {
            type: "audio",
            src: `https://cdn.texasbluesalley.com/audio/${seg.segmentMP3Filename}`
          }
        ],
        color: "teal"
      };
    if (this.objectHaveKeyLike(seg, "SoundSlice"))
      type = {
        type: "soundslice",
        sources: [
          {
            src: seg.segmentSoundSliceCode,
            type: "soundslice"
          }
        ],
        color: "blue"
      };
    if (this.objectHaveKeyLike(seg, "PDF"))
      type = {
        sources: [
          {
            src: `https://texasbluesalley.com/includes/pdfjs/web/viewer.html`, //?file=/assets/pdfs/${seg.segmentPDFCode}`,
            type: "pdf"
          }
        ],
        type: "pdf",
        color: "yellow"
      };
    if (this.objectHaveKeyLike(seg, "GPX"))
      type = {
        type: "pdf",
        sources: [
          {
            type: "gpx",
            src: seg.segmentGPXFilename
          }
        ],
        color: "purple"
      };
    type.to = seg.segmentID;
    return type;
  }
  parseURL(clickString) {
    clickString = clickString.slice(
      clickString.indexOf("https"),
      clickString.indexOf("')")
    );
    // console.log(clickString);
    return clickString;
  }
  parseIdx(clickString) {
    /**
     *  purpose: Parse packageID from html source (ex. thePlayer.openUnknownPackageType({ 'packageID': '9009', 'type': 'entry'}, true); return false;)
     */
    clickString = clickString.replace(/'/g, '"');
    const pkg = JSON.parse(clickString.match(/\{([^}]+)\}/g));
    pkg.packageID = parseInt(pkg.packageID);
    return pkg;
  }
  parseFavoriteHtml(html) {
    const $ = cheerio.load(html);
    // const favHtml = $(".accordion-title");
    const favHtml = $("#favoritesListAccordion");
    // console.log(
    //   favHtml.length > 0 ? "Loading Live Favs" : "Loading Mock Fav Data"
    // );
    return this.parseFavoriteData(
      favHtml.length > 0 ? favHtml : this.fakeFavHTML()
    );
  }
  parseFavoriteData(group) {
    const html = group.html();
    // console.log("Favshtml", group);
    const collection = [];
    const $ = cheerio.load(html);
    group.each((idx, e) => {
      let title = $(e)
        .text()
        .split(" ")[0]
        .trim();
      // this.favs[title] = [];
      let items = $(e)
        .parent()
        .find(".sidebar-list li");
      items.each((index, val) => {
        // console.log("val", $(val).find(".sidebar-list-item-link").text())
        const itm = {
          id: $(val)
            .find("form")
            .data("id"),
          title: $(val)
            .find(".sidebar-list-item-link")
            .text(),
          src: title
          //subtitle: $(e).find(".notification-body p").text(),
        };
        // console.log("item", itm);
        collection.push({
          ...itm
        });
      });
    });
    return collection;
  }
  parseNotificationHtml(html) {
    const $ = cheerio.load(html);
    let announcements = $("#announcements li");

    let updates = $("#course-updates li.notification");
    announcements = announcements.length
      ? this.parseNotificationData(announcements)
      : [];
    updates = updates.length ? this.parseNotificationData(updates) : [];

    // console.log("notes", announcements, updates);
    return {
      announcements: announcements,
      updates: updates
    };
  }

  parseNotificationData(group) {
    // console.log(group);
    const html = group.html();
    // console.log("html", html);
    const $ = cheerio.load(html);
    let collection = [];
    group.each((idx, e) => {
      const itm = {
        id: idx,
        title: $(e)
          .find(".notification-title span")
          .text(),
        subtitle: $(e)
          .find(".notification-body p")
          .text(),
        actionText: $(e)
          .find(".notification-body a")
          .text(),
        action: $(e)
          .find(".notification-body a")
          .attr("href")
      };
      collection.push({
        ...itm
      });
    });
    // console.log("col", collection);
    return collection;
  }

  async parseSearchResults(html) {
    // if (html) console.info("searchHTML", html);
    const $ = cheerio.load(html);
    const defaultSearch = $(".browser-result-wrapper>h5").length > 0;
    // console.log("defaultSearch", defaultSearch);
    return {
      filters: this.parseSearchFilters(
        $(".browser-result-wrapper"),
        defaultSearch
      ),
      pages: this.parsePagination($("div[id$=WrapperTop] ul li"))
    };
  }

  parsePagination(group) {
    const html = group.html();
    if (!html) return [];
    // console.log("html", html);
    const $ = cheerio.load(html);
    let collection = [];
    group.each((idx, e) => {
      const lnk = $(e).find("a");
      collection.push({
        url: this.parseURL(lnk.attr("onclick")),
        class: lnk.attr("class"),
        content: lnk.text(),
        icon: $(e)
          .find("a > i")
          .attr("class")
      });
    });
    // console.log("col", collection);
    return collection;
  }
  parseSearchFilters(group, defaultSearch = false) {
    // console.trace("gfi:group", group)
    let collection = defaultSearch ? {} : [];
    let section = "";
    const html = group.html();
    if (group.length < 1) {
      throw "No HTML to parse";
    }
    // console.info("html", html)
    const $ = cheerio.load(html);
    group.each((idx, e) => {
      if (defaultSearch && typeof e.attribs.id === "undefined") {
        section = $(e)
          .find("h5")
          .text();
        collection[section] = [];
      } else {
        const pkg = this.parseIdx(
          $(e)
            .find(".browser-result-image a")
            .attr("onclick")
        );
        // console.log('pkg', pkg)
        const itm = {
          id: pkg.packageID,
          type: pkg.type,
          src: pkg.type === "entry" ? "Courses" : pkg.type,
          avatar: $(e)
            .find("img")
            .attr("src"),
          title: $(e)
            .find(".browser-result-title a")
            .text()
            .trim(),
          subtitle: $(e)
            .find(".browser-result-description")
            .text()
            .trim(),
          data: $(e)
            .find(".browser-result-meta")
            .html()
            .trim()
        };
        // console.log("item",itm);
        if (defaultSearch) {
          collection[section].push({
            ...itm
          });
        } else {
          collection.push({ ...itm });
        }
      }
    });
    // console.log("col", collection);
    return collection;
  }
  parseCriteria(html) {
    const $ = cheerio.load(html);
    let hiddenFields = this.parseHiddenData($(".hiddenFields input"));
    // console.log("hiddenFields", hiddenFields);
    let funnelList = this.parseFunnels($(".filter-list"));
    // console.log(funnelList)

    return {
      auth: hiddenFields,
      funnels: funnelList.collection,
      status: funnelList.status
    };
  }

  parseHiddenData(group) {
    // console.log("grp", group)
    const $ = cheerio.load(group.html());
    const collection = {};
    group.each((idx, e) => {
      collection[$(e).attr("name")] = $(e).attr("value");
    });
    return collection;
  }

  parseFunnels(group) {
    // console.log('group', group)
    const $ = cheerio.load(group.html());
    const status = {};
    const collection = {};
    group.each((idx, e) => {
      let section = $(e).data();
      // console.log(`Section: ${JSON.stringify(section)}`)
      collection[section.sectionId] = section;
      collection[section.sectionId]["tags"] = [];
      collection[section.sectionId]["chips"] = [];
      $(e)
        .find(".filter-checkbox")
        .each((i, itm) => {
          const syncName = `${section.sectionId}__${itm.attribs.id}`;
          const { chips, tags, ...rest } = section;
          // console.log(rest)
          const chip = {
            sync: syncName,
            id: itm.attribs.id,
            name: itm.attribs.name,
            value: itm.attribs.value,
            group: rest,
            text: $(itm)
              .next()
              .text()
          };
          collection[section.sectionId].chips.push(chip);
          collection[section.sectionId].tags.push(chip.text);
          status[chip.sync] = false;
        });
    });
    return {
      status: status,
      collection: collection
    };
  }

  isFav(packageID) {
    var found = false;
    var foundException = {};
    try {
      Object.entries(this.favs).forEach(key => {
        const result = key[1].filter(({ id }) => id === packageID);
        found = typeof result[0] === "object";
        if (found) throw foundException;
      });
    } catch (error) {
      if (error !== foundException) throw foundException;
    }

    return found;
  }
  objectHaveKeyLike(obj, testString) {
    return Object.keys(obj).some(key => {
      return ~key.indexOf(testString);
    });
  }

  groupArrayOfObjects(list, key) {
    return list.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  epochToHuman(epoch, fmt) {
    var returnDate,
      myDate = new Date(Number(epoch) * 1000);
    switch (fmt) {
      case "day":
        returnDate = myDate.toLocaleDateString();
        break;
      case "time":
        returnDate = myDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
        break;
      default:
        returnDate = myDate.toGMTString();
    }
    return returnDate;
  }
  getDateFormats(epoch) {
    return {
      date: this.epochToHuman(epoch),
      day: this.epochToHuman(epoch, "day"),
      time: this.epochToHuman(epoch, "time")
    };
  }
  fakeFavHTML() {
    //#region

    const favhtml = `					
							



	<ul class="accordion sidebar-accordion" id="favoritesListAccordion" data-accordion data-allow-all-closed="true" data-multi-expand="false">

			
					
					<li class="accordion-item is-active" data-accordion-item>
						<a class="accordion-title">Courses <sup>9</sup></a>
						<div class="accordion-content" data-tab-content>
							<ul class="sidebar-list">
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4253', true); return false;">Texas Blues Speed Workshop - Level 1</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4253" data-id="4253" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413275" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7766', true); return false;">Clapton&#8217;s Influence: Worried Mind</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7766" data-id="7766" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413276" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4302', true); return false;">5 Boxes Essential Licks (2nd Edition)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4302" data-id="4302" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413277" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4272', true); return false;">Thanksgiving Ballad 2014</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4272" data-id="4272" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413278" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('5285', true); return false;">Clapton&#8217;s Influence: Crossroad Blues w/Bonus</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-5285" data-id="5285" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413279" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4304', true); return false;">5 Essential Blues Boxes</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4304" data-id="4304" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413280" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4250', true); return false;">Essential Fretboard</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4250" data-id="4250" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413281" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4300', true); return false;">The Grip</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4300" data-id="4300" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413282" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
				
			
				
							
			
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('4252', true); return false;">Texas Blues Speed Workshop - Level 2</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-4252" data-id="4252" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413283" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>
					
							</ul>
						</div>
					</li>
				
			
			
			
			
			
					
					<li class="accordion-item " data-accordion-item>
						<a class="accordion-title">Imported	 <sup>42</sup></a>
						<div class="accordion-content" data-tab-content>
							<ul class="sidebar-list">
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('10818', true); return false;">Lenny Kravitz - Always On The Run (Guitar Tutorial)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-10818" data-id="10818" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413284" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('10971', true); return false;">Unplugged Acoustic Blues Guitar Lesson (Part 2) - Play the blues by yourself on guitar - EP305</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-10971" data-id="10971" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413285" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('10999', true); return false;">How to play - Tito &amp; Tarantula - After Dark, easy guitar lesson (FULL+SOLO)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-10999" data-id="10999" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413286" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('11616', true); return false;">How To Solo Over 'Little Wing': 4 Levels - Beginner to Advanced Guitar</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-11616" data-id="11616" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413287" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('11136', true); return false;">Just The Two Of Us â© 3 Levels - 001</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-11136" data-id="11136" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413288" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('11141', true); return false;">EASY GUITAR LESSON | ENTER SANDMAN by Metallica</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-11141" data-id="11141" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413289" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9884', true); return false;">It's Easy to Play Fast | 10 Speedy but Simple Licks | Guitar Lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9884" data-id="9884" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413290" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9768', true); return false;">Acoustic Blues Guitar Lesson - 1 Bar Licks And Phrases With Chords For Beginners Or Intermediates</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9768" data-id="9768" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413291" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9787', true); return false;">Jamming Alone - Using 2 Bar Phrases With The Slow Blues In E Groove (Part 2 Of A Series)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9787" data-id="9787" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413292" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9508', true); return false;">Tennessee Whiskey - Guitar Lesson -Chris Stapleton - Intro/Rhythm/Solo w/tabs</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9508" data-id="9508" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413293" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9509', true); return false;">Tennessee Whiskey Guitar Lesson - Chris Stapelton</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9509" data-id="9509" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413294" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9271', true); return false;">Let It Be Guitar Tutorial - The Beatles Guitar Lesson |Easy Chords + Solo + Guitar Cover|</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9271" data-id="9271" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413295" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8511', true); return false;">Slow Blues Jam | Sexy Guitar Backing Track</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8511" data-id="8511" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413296" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8513', true); return false;">Eric Clapton Style Acoustic Blues Guitar Lesson !</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8513" data-id="8513" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413297" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8552', true); return false;">How To Play Breakdown (and then...) by Rowland S Howard - Guitar Lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8552" data-id="8552" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413298" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8732', true); return false;">Acoustic Blues Guitar Lesson - Open Positon E Run and Licks</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8732" data-id="8732" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413299" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8875', true); return false;">How to play Smoke On The Water by Deep Purple (Rock Guitar Lesson SB-311)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8875" data-id="8875" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413300" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8955', true); return false;">Stevie Ray Vaughn - Life By The Drop (Opening Lick) Guitar Lesson - Acoustic Blues</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8955" data-id="8955" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413301" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('9118', true); return false;">How to Play like Chicago Blues Legend Magic Sam</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-9118" data-id="9118" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413302" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('8054', true); return false;">Sleepwalk - Bass cover</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-8054" data-id="8054" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413303" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7949', true); return false;">Get Deep with some Funky Texas Style Acoustic Blues | Tuesday Blues 126</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7949" data-id="7949" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413304" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7953', true); return false;">How To Play Billy Strings' Dust In A Baggie - Advanced Bluegrass Guitar Lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7953" data-id="7953" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413305" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7959', true); return false;">Sleepwalk Bass Tutorial</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7959" data-id="7959" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413306" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7863', true); return false;">Wish You Were Here Guitar Lesson - Pink Floyd Complete Guitar Tutorial |Chords + Solos + TAB|</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7863" data-id="7863" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413307" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6387', true); return false;">how to play &quot;Over the Hills and Far Away&quot; on guitar by &quot;Led Zeppelin&quot; - acoustic guitar lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6387" data-id="6387" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413308" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7147', true); return false;">The Black Keys Thickfreakness Guitar Lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7147" data-id="7147" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413309" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('7155', true); return false;">30 Hot Rod Guitar Licks - #4 Hot Rod - Bill Kirchen</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-7155" data-id="7155" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413310" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6964', true); return false;">Man of Constant Sorrow | Guitar Lesson Tutorial</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6964" data-id="6964" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413311" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6907', true); return false;">ZZ Top - Jesus Just Left Chicago (Bass cover with tabs)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6907" data-id="6907" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413312" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6796', true); return false;">Kelly Valleau - Havana (Camila Cabello) - Fingerstyle Guitar</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6796" data-id="6796" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413313" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6777', true); return false;">Darren Watson | FREE BLUES GUITAR LESSON | Delta Blues Fingerstyle Lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6777" data-id="6777" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413314" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6610', true); return false;">How to play Have you ever Seen the Rain - Creedence Clearwater Revival / GuiTabs Guitar Lesson</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6610" data-id="6610" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413315" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6605', true); return false;">Jimmy Brown show us how to play Led Zepplin Immigrant Song</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6605" data-id="6605" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413316" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6521', true); return false;">how to play Angie on guitar by the Rolling Stones - acoustic guitar lesson_tutorial</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6521" data-id="6521" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413317" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6549', true); return false;">The Easiest Blues on Acoustic Guitar | Beginner Friendly</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6549" data-id="6549" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413318" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6522', true); return false;">John Mayer Gives Blues Guitar Lesson (2018)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6522" data-id="6522" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413319" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6552', true); return false;">Patience  - Guns N Roses / MusikMan #056</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6552" data-id="6552" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413320" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6547', true); return false;">Blues BASS LESSON with TAB - 12 Bar Bass Lines in A (including Turnarounds)</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6547" data-id="6547" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413321" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6350', true); return false;">Cornell Dupree Hot Licks Full VHS</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6350" data-id="6350" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413322" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6349', true); return false;">Ghost Riders in the Sky: Guitar Cover, The Outlaws, Full Song</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6349" data-id="6349" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413323" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6371', true); return false;">Lil Nas X - Old Town Road ft. Billy Ray Cyrus [Remix Instrumental]</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6371" data-id="6371" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413324" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
				
			
				
								<li class="sidebar-list-item button play ">
									<a class="sidebar-list-item-link" onClick="thePlayer.openPackage('6159', true); return false;">50 Texas Blues Licks - #19 Double Stop Lenny - Guitar Lesson - Corey Congilio</a>
									
										<form action="https://texasbluesalley.com/?ACT=330" accept-charset="utf-8" id="submitFavorite-6159" data-id="6159" data-action="remove" class="submitFavoriteForm" method="post"><div style="display:none">
<input type="hidden" name="params_id" value="8413325" />
</div>
												<input type="hidden" name="delete" value="yes" />
												<a class="sidebar-list-item-button delete-button" onClick="thePlayer.favoritesManager.removeFavoriteFromList(this); return false;"></a>
										</form>
									
								</li>

			
					
							</ul>
						</div>
					</li>
				
			

			
			
			
			
			
		
	</ul>
<script type="text/javascript">
	$(function() {$('#favoritesListAccordion').foundation();}); 
</script> 


`;
    //#endregion

    const $ = cheerio.load(favhtml);
    const mockHtml = $(".accordion-title");
    return mockHtml;
  }
  getCommentString(version) {
    var strComments = "";
    const staticWithoutComments = `<div id="add-cmt-wrapper" class="sidebar-controls-wrapper">
  <div class="row tight">
    <div class="columns small-6"> 
      
            
                <a class="checkbox-link" onClick="thePlayer.commentsManager.subscribeAction(this); return false;" data-action="https://texasbluesalley.com/?ACT=3&entry_id=4302&ret=proplayer74-tony/--ajax-load-comments">Notify Me</a>
            
      
    </div>
    <div class="columns small-6 text-right"> 
            
        <div class="option-buttons">
          <a class="option-button" onClick="thePlayer.commentsManager.setAuthorCommentFilter(false); return false;" href="#">All</a>
          <span class="option-button on">Mine</span>
        </div>
      
    </div>
  </div>
</div>


  

<div class="comment-screenname-notice">
  Commenting as <strong>Tony Moses</strong>. <a target="_blank" href="/account/dashboard">Change...</a>
</div>
            
<ul class="cmts-list" id="cmts-list" data-offset="0">
  
      <li id="no-questions">
        <div class="margin-top margin-bottom padded slight text-center">
          <p>Be the first to ask a question about this course or video.</p>
          <p>
            <a class="comment-action-button comment-view view" onClick="thePlayer.commentsManager.replyToComment(-1);" ><i class="fa fa-commenting"></i> Ask A Question</a>
          </p>
        </div>
      </li>
    
</ul>`;
    const staticWithComments = `<div id="add-cmt-wrapper" class="sidebar-controls-wrapper">
  <div class="row tight">
    <div class="columns small-6"> 
      
            
                <a class="checkbox-link" onClick="thePlayer.commentsManager.subscribeAction(this); return false;" data-action="https://texasbluesalley.com/?ACT=3&entry_id=4302&ret=proplayer74-tony/--ajax-load-comments">Notify Me</a>
            
      
    </div>
    <div class="columns small-6 text-right"> 
      
        <div class="option-buttons">
          <span class="option-button on">All</span>
          <a class="option-button" onClick="thePlayer.commentsManager.setAuthorCommentFilter(true); return false;" href="#">Mine</a>
        </div>
      
    </div>
  </div>
</div>


  

<div class="comment-screenname-notice">
  Commenting as <strong>Tony Moses</strong>. <a target="_blank" href="/account/dashboard">Change...</a>
</div>
            
<ul class="cmts-list" id="cmts-list" data-offset="0">
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-309-wrapper"
        data-comment-id="309" data-parent-id="0"
        data-level="0" data-date="1543078602">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>I really benefit from the &#8220;loops&#8221; feature in the 5 Boxes Essential Licks video - but Chrome and IE both act a bit odd.  Space bar pauses a loop (so I can work on it - very helpful) but it would be sweet if [TAB] or maybe [right arrow/left arrow] would jump to the next lick / previous lick.  Is there a way to move between licks without using the mouse?  Thanks much - David</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                David B
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('2718', true); return false;">
                    <i class="fa fa-clock-o"></i> 2 years ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-309-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-309-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(309);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(309); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-309-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-312-wrapper"
        data-comment-id="312" data-parent-id="309"
        data-level="1" data-date="1543410856">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hi David,</p>

<p>Do you mean activating the next loop or previous loop using the keyboard? If so, that&#8217;s a fantastic idea. It&#8217;s going to take some work, but I&#8217;ll definitely put that on my list of features to add.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('2718', true); return false;">
                    <i class="fa fa-clock-o"></i> 2 years ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded " 
        id="comment-358-wrapper"
        data-comment-id="358" data-parent-id="0"
        data-level="0" data-date="1558647789">
          <div class="cmt-inner">
          
            
              <a class="cmt-delete-button" onClick="thePlayer.commentsManager.deleteCmt(358,'https://texasbluesalley.com/?ACT=4'); return false;" href="#">
                <i class="fa fa-times-circle"></i>
              </a>
            
            <div class="cmt-text">
              <p>When learning/practicing 5 Boxes Essential Licks, what tempo is fast enough?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Steve J
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-358-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-358-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(358);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                </div>
              </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-384-wrapper"
        data-comment-id="384" data-parent-id="0"
        data-level="0" data-date="1566685211">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>it seems the pro player has been out of order ,ill check again later,</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Samsamcb@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-384-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-384-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(384);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(384); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-384-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-385-wrapper"
        data-comment-id="385" data-parent-id="384"
        data-level="1" data-date="1566758297">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>is the pro player out of order  ? or is it just on my sight?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Samsamcb@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('2718', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-386-wrapper"
        data-comment-id="386" data-parent-id="384"
        data-level="1" data-date="1566759874">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>I haven’t had any other reports. What browser are you using and are you seeing an error message?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-387-wrapper"
        data-comment-id="387" data-parent-id="384"
        data-level="1" data-date="1566922413">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>I  thought it was google chrome butt i see its google chromium .</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Samsamcb@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-388-wrapper"
        data-comment-id="388" data-parent-id="384"
        data-level="1" data-date="1566923107">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>It dose say there is an error with the pro player , on the orientation video butt if you have no other complaints i better up grade, i plan on useing this site for the rest of my days , you&#8217;ve done a greate job creating this site.  thankyou.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Samsamcb@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-391-wrapper"
        data-comment-id="391" data-parent-id="0"
        data-level="0" data-date="1568835403">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Anthony, I am missing some of the tablature for lesson 1  in the 5 boxes essential licks.  It ends at category 2.  They were available last night but not today.  Enjoying the content.  Thanks</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                bradcecil@bellsouth.net
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('2718', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-391-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-391-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(391);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(391); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-391-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-394-wrapper"
        data-comment-id="394" data-parent-id="391"
        data-level="1" data-date="1569288220">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hi Brad, We&#8217;re in the process of updating all the tabs for this course. New tabs for Lessons 1-4 are now available, with tabs for the rest coming in the next day or two. Let me know if you still don&#8217;t see them.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('2718', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-424-wrapper"
        data-comment-id="424" data-parent-id="0"
        data-level="0" data-date="1571518353">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hey Anthony the tabs for lesson 2 cat 2 aren&#8217;t printable when you go into the options part at the bottom of the tab.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                gladiator1897@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6621', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-424-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-424-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(424);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(424); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-424-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-425-wrapper"
        data-comment-id="425" data-parent-id="424"
        data-level="1" data-date="1571519725">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Thanks for letting me know. It should be fixed now.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6621', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-426-wrapper"
        data-comment-id="426" data-parent-id="0"
        data-level="0" data-date="1571524471">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>hey Anthony lesson 6 cat 2-3 tabs aren&#8217;t printable either.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                gladiator1897@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6693', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-426-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-426-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(426);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(426); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-426-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-427-wrapper"
        data-comment-id="427" data-parent-id="426"
        data-level="1" data-date="1571530788">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Thanks, fixed. I think I got all of them now.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-451-wrapper"
        data-comment-id="451" data-parent-id="0"
        data-level="0" data-date="1573090230">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hey Anthony, are the tabs for Lesson 1 Category 2 licks wrong? Should it be 7 5h6p5 for all of them? (not 5h7p5)</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                markcnelson86@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6618', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-451-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-451-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(451);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(451); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-451-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-455-wrapper"
        data-comment-id="455" data-parent-id="451"
        data-level="1" data-date="1573528472">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Good catch. I still had an old version of that file uploaded. If you reload it you&#8217;ll see that the first couple are 5h6p5 (as they should be) and only the last few are 5h7p5.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6618', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-453-wrapper"
        data-comment-id="453" data-parent-id="0"
        data-level="0" data-date="1573321469">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hi Anthony - Congrats on getting this great course updated!   Where do I go to find the backing tracks?  thanks.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Scott R
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6618', true); return false;">
                    <i class="fa fa-clock-o"></i> one year ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-453-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-453-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(453);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(453); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-453-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-454-wrapper"
        data-comment-id="454" data-parent-id="453"
        data-level="1" data-date="1573527953">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Oops, I forgot to upload them. I&#8217;ll try to get that done this week.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> one year ago
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-469-wrapper"
        data-comment-id="469" data-parent-id="0"
        data-level="0" data-date="1575428479">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hi Anthony , at the risk of being a pain, Can you please upload the backing tracks for these licks.   I&#8217;m really keen to practice them that way.   Thanks&#8230;</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Scott R
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> about 12 months ago
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-469-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-469-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(469);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(469); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-469-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-470-wrapper"
        data-comment-id="470" data-parent-id="469"
        data-level="1" data-date="1575434726">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Working hard to get remaining elements wrapped up for this course this week. Backing tracks are part of that.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> about 12 months ago
                </span>
              
            </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-481-wrapper"
        data-comment-id="481" data-parent-id="469"
        data-level="1" data-date="1576261677">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>They&#8217;re added. Let me know what you think :-)</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> 11 months ago
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-479-wrapper"
        data-comment-id="479" data-parent-id="0"
        data-level="0" data-date="1576185210">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hey Anthony, 
Drop me a note when u have a moment. Question about billing. No rush.</p>

<p>Mahalo,</p>

<p>CHRISTIAN</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                JCS
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7212', true); return false;">
                    <i class="fa fa-clock-o"></i> 11 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-479-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-479-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(479);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(479); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-479-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-480-wrapper"
        data-comment-id="480" data-parent-id="479"
        data-level="1" data-date="1576261663">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Send me an email at anthony@texasbluesalley.com</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> 11 months ago
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-484-wrapper"
        data-comment-id="484" data-parent-id="0"
        data-level="0" data-date="1576552616">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>i can&#8217;t find the tablature  for the category licks or the tab that puts them all to together</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                garylsamples@q.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('2725', true); return false;">
                    <i class="fa fa-clock-o"></i> 11 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-484-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-484-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(484);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(484); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-484-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-485-wrapper"
        data-comment-id="485" data-parent-id="484"
        data-level="1" data-date="1576553683">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hi Gary, I&#8217;m not sure I understand what you&#8217;re asking. Are you not seeing the tablature listed in each Lesson section?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('3295', true); return false;">
                    <i class="fa fa-clock-o"></i> 11 months ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-495-wrapper"
        data-comment-id="495" data-parent-id="0"
        data-level="0" data-date="1577132588">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hey Anthony, C2L2 Demo has a weird typo, and I wouldnt bother you with it but, since it involves parentheses  and could affect the way some code runs , I figured I would mention it.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                markcnelson86@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7160', true); return false;">
                    <i class="fa fa-clock-o"></i> 11 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-495-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-495-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(495);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(495); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-495-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-496-wrapper"
        data-comment-id="496" data-parent-id="495"
        data-level="1" data-date="1577132635">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>(under instant loops)</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                markcnelson86@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7160', true); return false;">
                    <i class="fa fa-clock-o"></i> 11 months ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-498-wrapper"
        data-comment-id="498" data-parent-id="495"
        data-level="1" data-date="1577996845">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Thanks, got it fixed.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7160', true); return false;">
                    <i class="fa fa-clock-o"></i> about 11 months ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded " 
        id="comment-497-wrapper"
        data-comment-id="497" data-parent-id="0"
        data-level="0" data-date="1577134434">
          <div class="cmt-inner">
          
            
              <a class="cmt-delete-button" onClick="thePlayer.commentsManager.deleteCmt(497,'https://texasbluesalley.com/?ACT=4'); return false;" href="#">
                <i class="fa fa-times-circle"></i>
              </a>
            
            <div class="cmt-text">
              <p>Under instant loops, Category 2 Lick 2,3, etc also still have that 7 5h7p5 instead of 7 5h6p6 - I didnt look extensively; just noting it before I forget.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                markcnelson86@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7160', true); return false;">
                    <i class="fa fa-clock-o"></i> 11 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-497-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-497-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(497);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                </div>
              </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-518-wrapper"
        data-comment-id="518" data-parent-id="0"
        data-level="0" data-date="1581230752">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Hi Anthony. In Lesson 2 Cat. 2 Lick 3, it shows chord ii in the video, but you explained it would sound good in chord V. Is that a problem?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Will_Ma
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7194', true); return false;">
                    <i class="fa fa-clock-o"></i> 9 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-518-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-518-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(518);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(518); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-518-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-519-wrapper"
        data-comment-id="519" data-parent-id="518"
        data-level="1" data-date="1581265115">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Great question. Lots of licks that resolve over the ii chord will also sound great over the V chord as well.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7194', true); return false;">
                    <i class="fa fa-clock-o"></i> 9 months ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded " 
        id="comment-567-wrapper"
        data-comment-id="567" data-parent-id="0"
        data-level="0" data-date="1587229765">
          <div class="cmt-inner">
          
            
              <a class="cmt-delete-button" onClick="thePlayer.commentsManager.deleteCmt(567,'https://texasbluesalley.com/?ACT=4'); return false;" href="#">
                <i class="fa fa-times-circle"></i>
              </a>
            
            <div class="cmt-text">
              <p>HI Anthony. I find it hard to understand at which chord am I in the backing track. can you provide the chord sequence the backing tracks please?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                itaibsn@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('7240', true); return false;">
                    <i class="fa fa-clock-o"></i> 7 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-567-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-567-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(567);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                </div>
              </div>
            
          </div>
    
      </li>
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-568-wrapper"
        data-comment-id="568" data-parent-id="0"
        data-level="0" data-date="1587398127">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Some of the 5 boxes 2nd Ed, have disappeared form the browser list once opened.  Lesson 5 C:2 through end.  Can you guide me to fix?</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                kawdaddy1500@gmail.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                    <i class="fa fa-clock-o"></i> 7 months ago
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-568-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-568-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(568);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(568); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-568-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-640-wrapper"
        data-comment-id="640" data-parent-id="568"
        data-level="1" data-date="1600306100">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Sorry, somehow I missed this when you posted it. There is only one category for Lesson 5. As we rolled out the new tablature, lesson videos and backing tracks, the old tablature and lesson videos were removed from the list, as they were no longer needed.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6688', true); return false;">
                    <i class="fa fa-clock-o"></i> 2 months ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
      <li class="cmt-wrapper level-0 expanded has-replies" 
        id="comment-638-wrapper"
        data-comment-id="638" data-parent-id="0"
        data-level="0" data-date="1600002854">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>I have been practicing these licks for about a week. I really appreciate your lessons because Texas Blues is the style of guitar I want to learn. I am having a hard time remembering all of these licks. I am still in lesson one and I am not moving on until I have them mastered. Please let me know if it is normal to have difficulty remembering the licks and if there are any tricks to remembering them faster. Thank you for a great coarse.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                kevin@dallaslease.com
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6618', true); return false;">
                    <i class="fa fa-clock-o"></i> 2 months ago
                  </a>
                </span>
              
            </div>
            
              <div class="row cmt-reply-wrapper no-padding" id="cmt-638-reply-wrapper">
                <div class="columns small-5"> 
                  <a class="comment-action-button comment-reply-button"
                    id="comment-638-reply-button" 
                    onClick="thePlayer.commentsManager.replyToComment(638);">Reply</a>
                </div>
                <div class="columns small-7 text-right"> 
                  
                    <a class="comment-action-button comment-view-replies-button view" onClick="thePlayer.commentsManager.toggleCmtReplies(638); return false;"><i class="fa fa-comments fa-fw"></i></a> 
                  
                </div>
              </div>
            
          </div>
    
      <ul class="cmt-replies-wrapper" id="comment-638-replies">
    
  
    
  
      <li class="cmt-wrapper level-1 expanded " 
        id="comment-639-wrapper"
        data-comment-id="639" data-parent-id="638"
        data-level="1" data-date="1600305940">
          <div class="cmt-inner">
          
            
            <div class="cmt-text">
              <p>Absolutely. When I&#8217;m learning a solo, it takes many, many, may repetitions until a lick is moved from my short-term memory to my muscle memory.</p>

            </div>
            <div class="cmt-meta">
              <span class="author-name non-breaking">
                <i class="fa fa-user-circle"></i> 
                Texas Blues Alley
              </span>, 
              
                <span class="cmt-date non-breaking">
                  <a onClick="thePlayer.openSegmentWithinCurrentPackage('6620', true); return false;">
                    <i class="fa fa-clock-o"></i> 2 months ago
                  </a>
                </span>
              
            </div>
            
          </div>
    
      
        </ul></li>
      
    
  
    
  
</ul>
`;
    switch (version) {
      case 1:
      case true:
        strComments = staticWithComments;
        break;
      case 0:
      case false:
      default:
        strComments = staticWithoutComments;
        break;
    }
    return strComments;
  }
}
