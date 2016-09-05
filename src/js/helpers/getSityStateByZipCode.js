module.exports = function(zip, callback) {
    if(zip.length >= 5 && typeof google != 'undefined'){
        let addr = {};
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'address': zip }, function(results, status){
            if (status == google.maps.GeocoderStatus.OK){
                if (results.length >= 1) {
                    /*for (var ii = 0; ii < results[0].address_components.length; ii++){
                        let street_number = '';
                        let route = '';
                        let city = '';
                        let types = results[0].address_components[ii].types.join(",");
                        if (types == "street_number"){
                            addr.street_number = results[0].address_components[ii].long_name;
                        }
                        if (types == "route" || types == "point_of_interest,establishment"){
                            addr.route = results[0].address_components[ii].long_name;
                        }
                        if (types == "sublocality,political" || types == "locality,political" || types == "neighborhood,political" || types == "administrative_area_level_3,political" ||
                            types == "political,sublocality,sublocality_level_1"
                            ){
                            addr.city = (city == '' || types == "locality,political") ? results[0].address_components[ii].long_name : city;
                        }
                        if (types == "administrative_area_level_1,political"){
                            // addr.state = results[0].address_components[ii].long_name;
                            addr.state = results[0].address_components[ii].short_name;
                        }
                        if (types == "postal_code" || types == "postal_code_prefix,postal_code"){
                            addr.zipcode = results[0].address_components[ii].long_name;
                        }
                        if (types == "country,political"){
                            addr.country = results[0].address_components[ii].long_name;
                        }
                    }*/
                    let formattedAddress = results[0].formatted_address;
                    let strs = formattedAddress.split(", ");
                    addr.city = strs[0];
                    addr.state = strs[1].substr(0, 2);
                    addr.success = true;
                    callback(addr);
                } else {
                    callback({success:false});
                }
            } else {
                callback({success:false});
            }
        });
    } else {
        callback({success:false});
    }
};