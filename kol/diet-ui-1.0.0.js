function sep(num, d) {
	if (num >= 1000) {
		var s = (num % 1000).toFixed(d || 0)
		while ((s.length) < (3 + (d ? d + 1 : 0))) {
			s = "0" + s
		}
		return sep(Math.floor(num / 1000)) + "," + s
	} else {
		return num
	}
}

function format_meat(price) {
	return sep(price) + "<span class=\"meatdesc\">&nbsp;Meat</span>"
}

function format_adv(adv) {
	var frac = Math.abs(adv) % 1
	if(frac.toString().length > 4) {
		return adv.toFixed(2)
	} else {
		return adv.toString()
	}
}

function make_exclude_link(item) {
	var elt = document.createElement("A")
	elt.href = "javascript:exclude(" + item.idx + ")"
	elt.innerText = "[x]"
	return elt
}

function make_reinclude_link(item) {
	var elt = document.createElement("A")
	elt.href = "javascript:reinclude(" + item.idx + ")"
	elt.innerText = "[reinclude]"
	return elt
}

function make_reinclude_all_link() {
	var elt = document.createElement("A")
	elt.href = "javascript:reinclude_all()"
	elt.innerText = "[reinclude all]"
	return elt
}

function item_tooltip(e, elt, item, desc, settings) {
	create_tooltip()
	var div = tooltip.div
	set_tooltip(e, elt)
	console.log(desc)
	var spec = desc && desc.item.spec
	item = item || spec.item
	var text = "";
	if(item) {
		var opts = (spec && spec.opts) || {};
		var table = ""
		function add_row(label, value) {
			table += "<tr><td class=\"tt-label\">" + label + "</td><td class=\"tt-value\">" + value + "</td>";
		}
		if("advmin" in item && (item.advmax != 0 || item.advmin != 0)) {
			add_row("Adventures", item.advmin == item.advmax ? item.advmin : item.advmin + "-" + item.advmax);
			var summary = (item.advmin != item.advmax)
			if(opts["munchies pill"]) {
				summary = true
				var munchies_min = calculate_munchies(item.advmin)
				var munchies_max = calculate_munchies(item.advmax)
				add_row("\u2192 munchies pill", munchies_min == munchies_max ? "+" + munchies_min : "+" + munchies_min + "-" + munchies_max)
			}
			if(item["item class"] == "wine") {
				if(settings && settings["mafia pinky ring available"]) {
					summary = true
					add_row("\u2192 mafia pinky ring", "+12.5%")
				}
				if(opts["brie"]) {
					summary = true
					add_row("\u2192 Refined Palate", "+25%")
				}
			}
			if(opts["salad fork"]) {
				summary = true
				add_row("\u2192 Ol' Scratch's salad fork", item["item class"] == "salad" ? "+50%" : "+30%")
			}
			if(opts["fudge spork"]) {
				summary = true
				add_row("\u2192 fudge spork", "+3")
			}
			if(opts["frosty mug"]) {
				summary = true
				add_row("\u2192 Frosty's frosty mug", item["item class"] == "beer" ? "+50%" : "+30%")
			}
			if(opts["shotglass"]) {
				summary = true
				add_row("\u2192 BGE shotglass", "+3")
			}
			if((opts["beer nuts"] || opts["beer nuts (wish)"]) && item["item class"] == "beer") {
				summary = true
				add_row("\u2192 Salty Mouth", "+5")
			}
			if(opts["taco sauce"] && item["item class"] == "taco") {
				summary = true
				add_row("\u2192 Taco Dan's Super Taco-Riffic Taco Sauce!", "+1")
			}
			if(item.type == "booze" && item.size[1] > 0 && (!desc || !desc.item.using_mime_shotglass)) {
				summary = true
				add_row("\u2192 Ode to Booze", "+" + item.size[1]);
			}
			if(opts["gar-ish"] && item["item class"] == "lasagna") {
				summary = true
				add_row("\u2192 Gar-ish", "+5");
			}
			if(settings && settings["pizza lover available"] && item["item class"] == "pizza") {
				summary = true
				add_row("\u2192 Pizza Lover", item["size"][0])
			}
			if(settings && settings["saucemaven available"] && item["item class"] == "saucy food") {
				summary = true
				var classid = settings["classid"]
				add_row("\u2192 Saucemaven", classid == 3 || classid == 4 ? "+5" : "+3")
			}
			if(settings && settings["tuxedo shirt available"] && item["tuxedo boostable drink"]) {
				summary = true
				add_row("\u2192 tuxedo shirt", "+2")
			}
			if(opts["mayoflex"]) {
				summary = true
				add_row("\u2192 Mayoflex", "+1")
			}
			if(opts["special seasoning"]) {
				summary = true
				add_row("\u2192 Special Seasoning", "+1")
			}
			if(item["name"] == "Affirmation Cookie") {
				summary = true
				add_row("\u2192 Bonus", "+6")
			}
			if(item["name"] == "spaghetti breakfast") {
				summary = true
				add_row("\u2192 Bonus", "+5")
			}
			if(item["name"] == "Cold One") {
				summary = true
				add_row("\u2192 Bonus", "+5")
			}
			if(summary && spec) {
				var adv = spec.adv
				if(desc && desc.item.using_mime_shotglass) {
					adv -= 1
				}
				add_row("\u2192 Total", format_adv(adv))
			}
		}
		if(item.pvpfights && item.pvpfights != 0) {
			add_row("PvP fights", item.pvpfights)
		}
		if(item.size || (spec && spec.size)) {
			var size = item.size || spec.size;
			if(size[0] > 0) {
				add_row("Fullness", size[0]);
			}
			if(size[1] > 0) {
				add_row("Drunkenness", size[1]);
			}
			if(size[2] > 0) {
				add_row("Spleen", size[2]);
			}
			if(size[0] < 0) {
				add_row("Fullness", size[0]);
			}
			if(size[1] < 0) {
				add_row("Drunkenness", size[1]);
			}
			if(size[2] < 0) {
				add_row("Spleen", size[2]);
			}
		}
		if(item.price) {
			add_row("Cost", sep(item.price, 2))
		}
		var first = true
		if(table !== "") {
			text += "<table>" + table + "</table>"
			first = false
		}
		if(notes[item.name]) {
			if(!first) {
				text += "<hr>"
			}
			text += notes[item.name]
			first = false
		}
		if(class_notes[item["item class"]]) {
			text += "<hr>" + class_notes[item["item class"]]
		}
		if(item.limit && !item.internal_limit) {
			var interval = item.interval || "day"
			text += "<hr><p>Consumption of this item is limited to " + item.limit + " per " + interval + ".</p>"
		}
	}
	div.innerHTML = text;
}

function make_item_link(item, settings) {
	var elt = make_link(item.name)
	elt.onmouseover = function(e) {
		item_tooltip(e, elt, item, false, settings)
	}
	elt.onmouseout = function(e) {
		remove_tooltip()
	}
	return elt
}

function make_desc_link(desc, settings) {
	var elt = make_link(desc.name)
	elt.onmouseover = function(e) {
		item_tooltip(e, elt, false, desc, settings)
	}
	elt.onmouseout = function(e) {
		remove_tooltip()
	}
	return elt
}


function make_link(name) {
	var wiki_name = name.replace(/ /g, "_")
	wiki_name = wiki_name.substr(0, 1).toUpperCase() + wiki_name.substr(1)
	var div = document.createElement("DIV")
	div.innerHTML = wiki_name
	wiki_name = div.innerText
	var elt = document.createElement("A")
	elt.className = "nowrap"
	elt.href = "https://kol.coldfront.net/thekolwiki/index.php/" + wiki_name
	elt.target = "_blank"
	// HTML because limbos has italic tags in the name...
	elt.innerHTML = name
	return elt
}

function make_extra(extra, settings) {
	var span = document.createElement("SPAN")
	span.className = "nowrap"
	
	if(extra.type == "text") {
		span.innerText = extra.text
	} else if(extra.type == "item") {
		var item = extra.item
		span.appendChild(document.createTextNode(extra.verb + " "))
		if(extra.exclude) {
			span.appendChild(make_exclude_link(item))
			span.appendChild(document.createTextNode(" "))
		}
		span.appendChild(make_item_link(item, settings))
	} else if(extra.type == "effect") {
		span.appendChild(document.createTextNode(extra.verb + " "))
		span.appendChild(make_link(extra.effect))
	} else {
		throw "invalid extra"
	}
	return span
}

function make_diet_object(result, settings) {
	//var diet_items = compute_diet(settings)
	var diet_items = result.diet_items;
	var last_sortkey = -1000
	var sum_turns = 0
	var sum_fights = 0
	var sum_price = 0
	var sum_value = 0
	var fortune_cookies = 0
	var fortune_value = 0
	var body_elts = []
	var body_elt = document.createElement("TBODY")
	body_elts.push(body_elt)
	for (var x_i in diet_items) {
		var x = diet_items[x_i]
		sum_turns += x.turns
		sum_fights += x.fights
		sum_price += x.price
		sum_value += x.value
		fortune_cookies += x.fortune
		fortune_value += x.fortune_value
		if (Math.floor(x.sortkey/1000) != Math.floor(last_sortkey/1000) && last_sortkey != -1000) {
			body_elt = document.createElement("TBODY")
			body_elts.push(body_elt)
		}
		if (x.sortkey != -1000) {
			var tr = document.createElement("TR")
			body_elt.appendChild(tr)
			
			var td
			td = document.createElement("TD")
			td.className = "quantity"
			td.innerText = x.desc.amount
			tr.appendChild(td)
			
			td = document.createElement("TD")
			td.className = "item"
			td.appendChild(make_exclude_link(x.desc))
			td.appendChild(document.createTextNode("\u00a0"))
			td.appendChild(make_desc_link(x.desc, settings))
			
			var extra = x.desc["extra"]
			if(extra.length > 0) {
				td.appendChild(document.createTextNode(" ("))
				td.appendChild(make_extra(extra[0], settings));
				for(var i = 1; i < extra.length; i++) {
					td.appendChild(document.createTextNode(", "))
					td.appendChild(make_extra(extra[i]))
				}
				td.appendChild(document.createTextNode(")"))
			}
			
			tr.appendChild(td)
			
			td = document.createElement("TD")
			td.className = "turns"
			td.innerText = x.desc.turns
			tr.appendChild(td)
			
			td = document.createElement("TD")
			td.className = "cost"
			td.innerHTML = format_meat(x.desc.price)
			tr.appendChild(td)
			
			td = document.createElement("TD")
			td.className = "notes"
			td.innerHTML = x.desc.notes
			tr.appendChild(td)
			
			last_sortkey = x.sortkey
		}
	}

	var table = document.createElement("TABLE")
	var diet_text = ""
	diet_text += "<thead><tr>"
	diet_text += "<th class=\"quantity\" data-shorthand=\"Qty.\"><span>Quantity</span></th>"
	diet_text += "<th class=\"item\">Item</th>"
	diet_text += "<th class=\"turns\" data-shorthand=\"Advs.\"><span>Adventures</span></th>"
	diet_text += "<th class=\"cost\" data-shorthand=\"Cost\"><span>Cost (each)</span></th>"
	diet_text += "<th class=\"notes\">Notes</th>"
	diet_text += "</tr></thead>"
	diet_text += "<tfoot><tr>"
	diet_text += "<td class=\"quantity\" rowspan=\"2\"></td>"
	diet_text += "<td class=\"item\">Total</td>"
	var totalnote = desc_number(sum_turns) + " &times; " + desc_number(result.adventure_value) + " Meat"
	var totalprofit = sum_turns * result.adventure_value
	if (fortune_cookies > 0) {
		totalnote += " + " + desc_number(fortune_value) + " Meat from semirares"
		totalprofit += fortune_value
	}
	var fightextratext = ""
	if (sum_fights > 0) {
		fightextratext = " + " + sum_fights + " PvP"
		totalnote += " + " + desc_number(sum_fights) + " &times; " + desc_number(result.pvp_value) + " Meat"
		totalprofit += sum_fights * result.pvp_value
	}
	totalnote += " - " + desc_number(sum_price) + " Meat"
	totalprofit -= sum_price
	totalnote += " = " + desc_number(totalprofit) + " Meat"
	totalnote += "<br><small>(When the utility of 1 Adventure is worth " + desc_number(result.adventure_value) + " Meat to you.)</small>"
	diet_text += "<td class=\"turns\">" + desc_number(sum_turns) + fightextratext + "</td>"
	diet_text += "<td class=\"cost\">" + desc_number(sum_price) + "<span class=\"meatdesc\">&nbsp;Meat</span></td>"
	//diet_text += "<td class=\"notes\">" + totalnote + "</td>"
	diet_text += "<td class=\"notes\"></td>"
	diet_text += "</tr>"
	diet_text += "<tr><td class=\"notes\" colspan=\"4\">" + totalnote + "</td></tr>"
	diet_text += "</tfoot>"
	//diet_text += diet_body
	table.innerHTML = diet_text
	for(var i = 0; i < body_elts.length; i++) {
		table.appendChild(body_elts[i])
	}
	return { "diet_elt": table, "sum_turns": sum_turns, "sum_price": sum_price, "sum_value": sum_value }
}

var container_elts = [];

function optimize_settings(settings, container) {
	for(var idx in container_elts) {
		container.removeChild(container_elts[idx])
	}
	container_elts = []
	
	var best_result
	var best_choices
	
	var organ_types = ["none", "stomach", "liver", "spleen", "custom"]
	var organ_text = saved_settings.organ
	
	for (var o_i in organ_types) {
		var o = organ_types[o_i]
		if (organ_text != o && organ_text != "best") continue
		if (organ_text != o && o == "custom") continue
		var organ_sizes = [15, 14, 15]
		if (o == "stomach") organ_sizes[0] += 5
		else if (o == "liver") organ_sizes[1] += 5
		else if (o == "spleen") organ_sizes[2] += 5
		else if (o == "custom") {
			var food = parseInt(saved_settings.food_space, 10)
			var booze = parseInt(saved_settings.booze_space, 10)
			var spleen = parseInt(saved_settings.spleen_space, 10)
			if (food >= 0 && booze >= 0 && spleen >= 0) organ_sizes = [food, booze, spleen]
		}

		if (saved_settings.pantsgiving)
			organ_sizes[0] += 1
		organ_sizes[1] += parseInt(saved_settings.sweatpants)

		settings["organ sizes"] = organ_sizes

		var result = tehtmi(settings)
		if(!best_result || result.value > best_result.value) {
			result.adventure_value = settings["adventure value"]
			result.pvp_value = settings["pvp fight value"]
			best_result = result
			best_choices = { organ: o }
		}
	}
	
	var r = make_diet_object(best_result, settings)
	if (organ_text == "best") {
		var best_organ_div = document.createElement("DIV")
		best_organ_div.innerText = "Steel organ: " + best_choices.organ
		container.appendChild(best_organ_div)
		container_elts.push(best_organ_div)
	}
	container.appendChild(r.diet_elt)
	container_elts.push(r.diet_elt)
	
	var excluded_list = []
	for(var i = 0; i < diet_consumables.length; i++) {
		var item = diet_consumables[i]
		if(saved_settings.excluded_consumables[item.name]) {
			if(!item.idx) {item.idx = i}
			excluded_list.push(item)
		}
	}
	if(excluded_list.length > 0) {
		excluded_list.sort(function(a,b) {return a.name.localeCompare(b.name, "en", {"sensitivity": "base"})})
		var excluded_div = document.createElement("DIV")
		var elt = document.createElement("B")
		elt.innerText = "Excluded items:"
		excluded_div.appendChild(elt)
		var ul = document.createElement("UL")
		for(var i = 0; i < excluded_list.length; i++) {
			var item = excluded_list[i]
			var li = document.createElement("LI")
			li.className = "item"
			li.appendChild(make_reinclude_link(item))
			li.appendChild(document.createTextNode("\u00a0"))
			li.appendChild(make_item_link(item, settings))
			ul.appendChild(li)
		}
		if(excluded_list.length >= 2) {
			var li = document.createElement("LI")
			li.className = "item"
			li.appendChild(make_reinclude_all_link())
			ul.appendChild(li)
		}
		excluded_div.appendChild(ul)
		container.appendChild(excluded_div)
		container_elts.push(excluded_div)
	}
}

function exclude(itemidx) {
	var excluded_consumables = saved_settings.excluded_consumables
	var item = diet_consumables[itemidx]
	excluded_consumables[item.name] = true
	save_settings()
	recompute_diet()
}

function reinclude(itemidx) {
	var excluded_consumables = saved_settings.excluded_consumables
	var item = diet_consumables[itemidx]
	delete excluded_consumables[item.name]
	save_settings()
	recompute_diet()
}

function reinclude_all() {
	saved_settings.excluded_consumables = {}
	save_settings()
	recompute_diet()
}

function recompute_diet() {
	var before = new Date().getTime()

	var settings = {
		"item data": diet_consumables,
		"excluded consumables": saved_settings.excluded_consumables,
	}

	var adventure_value = saved_settings.value

	if (adventure_value == "custom") {
		settings["adventure value"] = parseInt(saved_settings.adventure_value, 10)
		settings["pvp fight value"] = parseInt(saved_settings.pvpfight_value, 10)
	} else {
		settings["adventure value"] = parseInt(adventure_value, 10)
		settings["pvp fight value"] = 0
	}
	
	settings["include nightcap"] = saved_settings.nightcap
	
	settings["tiny plastic sword available"] = saved_settings.tps
	settings["tuxedo shirt available"] = saved_settings.tuxedo
	settings["mafia pinky ring available"] = saved_settings.mafiaring
	settings["mime army shotglass available"] = saved_settings.mimeglass
	settings["pantsgiving available"] = saved_settings.pantsgiving
	settings["designer sweatpants available"] = saved_settings.sweatpants
	settings["saucemaven available"] = saved_settings.saucemaven
	settings["pizza lover available"] = saved_settings.pizzalover
	settings["spaghetti breakfast available"] = saved_settings.breakfast
	settings["grab a cold one available"] = saved_settings.coldone
	settings["ancestral recall available"] = saved_settings.recall
	settings["speakeasy"] = saved_settings.speakeasy
	
	settings["classid"] = parseInt(saved_settings.classid, 10)
	settings["semirares available"] = parseInt(saved_settings.semirares, 10)
	settings["workshed"] = saved_settings.workshed
	settings["nightcap limit"] = parseInt(saved_settings.nightcap_limit, 10)
	settings["use potion of the field gar"] = ((saved_settings.ismonday == "yes") ? "no" : "yes")
	
	optimize_settings(settings, document.getElementById("dietdiv"))
	
	var after = new Date().getTime()
	//console.log("time taken (eleron)", after - before)
}

var modal_initialized = false
var modal_id = false

function enable_modal(id) {
	var blocker = document.getElementById("blocker")
	var modal = document.getElementById(id)
	if(!modal_initialized) {
		blocker.onclick = function(e) { if(e.target == blocker) { disable_modal() } }
		modal_initialized = true
	}
	modal_id = id
	blocker.style.display = ""
	modal.style.display = ""
	return id
}

function disable_modal() {
	var blocker = document.getElementById("blocker")
	if(modal_id) {
		var modal = document.getElementById(modal_id)
		modal.style.display = "none"
		modal_id = false
	}
	blocker.style.display = "none"
}

var saved_settings = {
	excluded_consumables: {},
}
var settings_initialized = false

function serialize(x) {
	return window.btoa(JSON.stringify(x))
}

function unserialize(data) {
	try {
		return JSON.parse(window.atob(data))
	} catch(err) {
		console.log(err)
		console.log(data)
		return false
	}
}

function sanitize_profiles(profiles) {
	if(!profiles) {
		profiles = {}
	}
	if(!profiles.last_id) {
		profiles.last_id = 1
		profiles.ids = ["1"]
		profiles.names = [""]
	}
	if(!("ids" in profiles)) {
		profiles.ids = []
	}
	if(profiles.ids.length == 0) {
		profiles.last_id += 1
		profiles.ids.push(profiles.last_id.toString())
	}
	if(!("names" in profiles)) {
		profiles.names = []
	}
	for(var i = profiles.names.length; i < profiles.ids.length; i++) {
		profiles.names.push("")
	}
	if(!("current" in profiles) || profiles.current >= profiles.ids.length) {
		profiles.current = 0
	}
	return profiles
}

function sanitize_settings(settings) {
	if(!settings) {
		settings = {}
	}
	if(!("excluded_consumables" in settings)) {
		settings.excluded_consumables = {}
	}
	return settings
}

var fake_storage = {}
var force_fake_storage = false

function is_storage_available() {
	return !force_fake_storage && typeof(Storage) !== "undefined"
}

function store_settings_data(id, settings) {
	var key = "settings" + id
	var data = serialize(settings)
	if(is_storage_available()) {
		window.localStorage.setItem(key, data)
	} else {
		fake_storage[key] = data
	}
}

function has_settings_data(id) {
	var key = "settings" + id
	if(is_storage_available()) {
		return localStorage.getItem(key) !== null
	} else {
		return key in fake_storage
	}
}

function load_settings_data(id) {
	var key = "settings" + id
	var settings = false;
	if(is_storage_available()) {
		var data = localStorage.getItem(key)
		if(data) {
			settings = unserialize(data)
		}
	} else {
		if(key in fake_storage) {
			settings = unserialize(fake_storage[key])
		}
	}
	return sanitize_settings(settings)
}

function delete_settings_data(id) {
	var key = "settings" + id
	if(is_storage_available()) {
		localStorage.removeItem(key)
	} else {
		delete fake_storage[key]
	}
}

function prune_settings_data(profiles) {
	var valid_keys = {}
	valid_keys.profiles = true
	for(var i = 0; i < profiles.ids.length; i++) {
		var key = "settings" + profiles.ids[i]
		valid_keys[key] = true
	}
	if(is_storage_available) {
		var invalid_keys = []
		for(var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i)
			if(!valid_keys[key]) {
				invalid_keys.push(key)
			}
		}
		for(var i = 0; i < invalid_keys.length; i++) {
			localStorage.removeItem(invalid_keys[i])
		}
	} else {
		var invalid_keys = []
		for(var key in fake_storage) {
			if(!valid_keys[key]) {
				invalid_keys.push(key)
			}
		}
		for(var i = 0; i < invalid_keys.length; i++) {
			delete fake_storage[invalid_keys[i]]
		}
	}
}

function import_export_settings_dialog() {
	enable_modal("import-export-modal")
	var info = document.getElementById("import-export-info")
	info.style.visibility = "hidden"
}

function store_profile_data(profiles) {
	for(var i = 0; i < profiles.ids.length; i++) {
		if(profiles.ids[i] == current_profile_id) {
			profiles.current = i
			break
		}
	}
	if(is_storage_available()) {
		window.localStorage.setItem("profiles", serialize(profiles))
	} else {
		fake_storage.profiles = serialize(profiles)
	}
}

function load_profile_data() {
	var profiles = false
	if(is_storage_available()) {
		var profiles_data = window.localStorage.getItem("profiles")
		if(profiles_data) {
			profiles = unserialize(profiles_data)
		}
	} else {
		profiles_data = unserialize(fake_storage.profiles)
	}
	return sanitize_profiles(profiles)
}

function profiles_dialog() {
	enable_modal("profile-modal")
}

function about() {
	enable_modal("about-modal")
}

function changes() {
	enable_modal("changes-modal")
}

function export_settings() {
	var s = serialize(saved_settings)
	var data = document.getElementById("import-export-data")
	data.value = s
	data.select()
	var info = document.getElementById("import-export-info")
	info.style.visibility = "hidden"
	var info = document.getElementById("import-export-info-all")
	info.style.visibility = "hidden"
}

function export_settings_all() {
	var profiles = load_profile_data()
	profiles.data = []
	for(var i = 0; i < profiles.ids.length; i++) {
		var id = profiles.ids[i]
		var settings
		if(current_profile_id == id) {
			settings = saved_settings
		} else {
			settings = load_settings_data(id)
		}
		profiles.data[i] = settings
	}
	var s = serialize(profiles)
	var data = document.getElementById("import-export-data-all")
	data.value = s
	data.select()
	var info = document.getElementById("import-export-info")
	info.style.visibility = "hidden"
	var info = document.getElementById("import-export-info-all")
	info.style.visibility = "hidden"
}

function import_settings() {
	var data = document.getElementById("import-export-data")
	var settings = unserialize(data.value)
	var info = document.getElementById("import-export-info")
	info.style.visibility = "visible"
	if(settings) {
		saved_settings = sanitize_settings(settings)
		save_settings()
		info.textContent = "Settings imported successfully..."
		reflect_settings()
		update_ui()
		recompute_diet()
	} else {
		info.textContent = "Settings could not be imported..."
	}
	var info = document.getElementById("import-export-info-all")
	info.style.visibility = "hidden"
}

function import_settings_all() {
	var data = document.getElementById("import-export-data-all")
	var profiles = unserialize(data.value)
	var info = document.getElementById("import-export-info-all")
	info.style.visibility = "visible"
	if(profiles) {
		for(var i = 0; i < profiles.ids.length; i++) {
			var id = profiles.ids[i]
			var settings = sanitize_settings(profiles.data[i])
			if(i == profiles.current) {
				saved_settings = settings
			}
			store_settings_data(id, settings)
		}
		delete profiles.data
		store_profile_data(profiles)
		prune_settings_data(profiles)
		
		info.textContent = "Settings imported successfully..."
		reflect_profiles(profiles)
		reflect_settings()
		update_ui()
		recompute_diet()
	} else {
		info.textContent = "Settings could not be imported..."
	}
	var info = document.getElementById("import-export-info")
	info.style.visibility = "hidden"
}

var ids = [
	"value", "organ", "nightcap", "ismonday", "classid", "semirares", "workshed",
	"saucemaven", "pizzalover", "breakfast", "coldone", "recall",
	"tuxedo", "mafiaring", "mimeglass", "tps", "pantsgiving", "sweatpants",
	"speakeasy",
	"adventure_value", "pvpfight_value",
	"food_space", "booze_space", "spleen_space",
	"nightcap_limit",
]

function reflect_profiles(profiles) {
	// input
	var profile_select = document.getElementById("profile")
	var options = []
	for(var i = 0; i < profile_select.children.length; i++) { options.push(profile_select.children[i]) }
	for(var i = options.length; i < profiles.ids.length; i++) {
		var option = document.createElement("OPTION")
		profile_select.appendChild(option)
		options.push(option)
		
	}
	for(var i = 0; i < options.length; i++) {
		var option = options[i]
		if(i < profiles.ids.length) {
			option.value = profiles.ids[i]
			option.textContent = profiles.names[i] || ("Profile " + profiles.ids[i])
		} else {
			profile_select.removeChild(option)
		}
	}
	
	profile_select.value = current_profile_id
	var name = ""
	for(var i = 0; i < profiles.ids.length; i++) {
		if(profiles.ids[i] == current_profile_id) {
			name = profiles.names[i] || ""
			break
		}
	}
	
	var profile_name = document.getElementById("profile-name")
	profile_name.value = name
	name = name || ("Profile " + current_profile_id)
	
	if(profiles.ids.length <= 1) {
		document.title = "Kingdom of Loathing diet calculator"
		profile_select.style.display = "none"
	} else {
		document.title = name + "'s diet calculator"
		profile_select.style.display = ""
	}
}

function reflect_settings() {
	var settings = saved_settings
	for(var i = 0; i < ids.length; i++) {
		var id = ids[i]
		var elt = document.getElementById(id)
		if(id in settings) {
			if(elt.type == "checkbox") {
				elt.checked = settings[id]
			} else {
				elt.value = settings[id]
			}
		} else {
			if(elt.type == "checkbox") {
				settings[id] = elt.checked
			} else {
				settings[id] = elt.value
			}
		}
	}
}

function update_ui() {
	var settings = saved_settings
	var organ_container = document.getElementById("customize_organ_space")
	if(settings.organ == "custom") {
		organ_container.style.display = ""
	} else {
		organ_container.style.display = "none"
	}
	var value_container = document.getElementById("customize_adventure_value")
	if(settings.value == "custom") {
		value_container.style.display = ""
	} else {
		value_container.style.display = "none"
	}
	var nightcap_container = document.getElementById("customize_nightcap")
	if(settings.nightcap == "limited") {
		nightcap_container.style.display = ""
	} else {
		nightcap_container.style.display = "none"
	}
}

var current_profile_id = null

function new_profile() {
	var profiles = load_profile_data()
	var id = profiles.last_id + 1
	profiles.last_id = id
	id = id.toString()
	profiles.ids.push(id)
	profiles.names.push("")
	current_profile_id = id
	reflect_profiles(profiles)
	save_settings()
	store_profile_data(profiles)
}

function delete_profile() {
	var profiles = load_profile_data()
	if(profiles.ids.length > 1) {
		for(var i = 0; i < profiles.ids.length; i++) {
			var id = profiles.ids[i]
			if(id == current_profile_id) {
				profiles.ids.splice(i, 1)
				profiles.names.splice(i, 1) 
				load_profile(profiles.ids[Math.max(i - 1, 0)])
				reflect_profiles(profiles)
				store_profile_data(profiles)
				prune_settings_data(profiles)
				recompute_diet()
				return
			}
		}
	}
}

function profile_changed() {
	var profiles = load_profile_data()
	var profile_select = document.getElementById("profile")
	for(i = 0; i < profiles.ids.length; i++) {
		var id = profiles.ids[i]
		if(id == profile_select.value) {
			load_profile(id)
			reflect_profiles(profiles)
			store_profile_data(profiles) // save current
			recompute_diet()
			return
		}
	}
	// Profile no longer exists; refresh UI and change back
	reflect_profiles(profiles)
}

function profile_data_changed() {
	var profiles = load_profile_data()
	var profile_name = document.getElementById("profile-name")
	for(var i = 0; i < profiles.ids.length; i++) {
		var id = profiles.ids[i]
		if(id == current_profile_id) {
			profiles.names[i] = profile_name.value
			reflect_profiles(profiles)
			store_profile_data(profiles)
			break
		}
	}
}

function load_profile(id) {
	current_profile_id = id
	saved_settings = load_settings_data(id)
	reflect_settings()
	update_ui()
}

function save_settings() {
	store_settings_data(current_profile_id, saved_settings)
}

function settings_changed() {
	
	if(current_profile_id == null) {
		
		// initialization 
		var php_mode = (window.location.search !== "")
		
		if(php_mode) {
			// php handling; turn off local storage support
			force_fake_storage = true
		}
		
		var profiles = load_profile_data()
		current_profile_id = profiles.ids[profiles.current]
		reflect_profiles(profiles)
		
		if(has_settings_data(current_profile_id)) {
			load_profile(current_profile_id)
		} else {
			// First time; use current DOM values (maybe set by PHP or else default)
			reflect_settings()
			save_settings()
			update_ui()
		}
	} else {
		for(var i = 0; i < ids.length; i++) {
			var id = ids[i]
			var elt = document.getElementById(id)
			if(elt.type == "checkbox") {
				saved_settings[id] = elt.checked
			} else {
				saved_settings[id] = elt.value
			}
		}
		save_settings()
		update_ui()
	}
	
	recompute_diet()
}

var tooltip = {};

function create_tooltip() {
	if(!tooltip.init) {
		tooltip.init = true
		
		var outerdiv = document.getElementsByTagName("body")[0]
		
		var container = document.createElement("DIV");
		container.id = "tooltip-container";
		container.style.display = "none";
		tooltip.container = container;
		
		var spacer = document.createElement("DIV");
		spacer.id = "tooltip-spacer";
		tooltip.spacer = spacer;
		container.appendChild(spacer);
		
		var div = document.createElement("DIV");
		div.id = "tooltip";
		tooltip.div = div;
		container.appendChild(div);
		
		outerdiv.appendChild(container);
	}
}

function set_tooltip(e, elt) {
	tooltip.container.style.display = "";
	
	var width = tooltip.div.offsetWidth;
	var height = tooltip.div.offsetHeight;
	
	var rect = elt.getBoundingClientRect();
	
	var x = rect.right + 2;
	var clientWidth = document.documentElement.clientWidth;
	if(x + width + 5 > clientWidth) {
		tooltip.container.style.left = "";
		tooltip.container.style.right = "5px";
	}
	else {
		tooltip.container.style.right = "";
		tooltip.container.style.left = (pageXOffset + x) + "px";
	}
	
	var y = rect.bottom + 2;
	tooltip.spacer.style.height = (pageYOffset + y) + "px";
	
	tooltip.active = true;
}

function remove_tooltip() {
	tooltip.active = false;
	tooltip.container.style.display = "none";
}
