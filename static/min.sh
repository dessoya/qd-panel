rm -rf ./min
mkdir ./min

TOTAL=19
echo " 1/$TOTAL config"
java -jar ./compiler.jar ./config.js --jscomp_off=globalThis > ./min/config.js

echo " 2/$TOTAL md5"
java -jar ./compiler.jar ./md5.js --jscomp_off=globalThis --warning_level QUIET > ./min/md5.js

echo " 3/$TOTAL cookie"
java -jar ./compiler.jar ./cookie.js --jscomp_off=globalThis > ./min/cookie.js

echo " 4/$TOTAL Class"
java -jar ./compiler.jar ./Class.js --jscomp_off=globalThis > ./min/Class.js

echo " 5/$TOTAL AJAX"
java -jar ./compiler.jar ./AJAX.js --jscomp_off=globalThis > ./min/AJAX.js

echo " 6/$TOTAL auth"
java -jar ./compiler.jar ./auth.js --jscomp_off=globalThis > ./min/auth.js

echo " 7/$TOTAL Sections"
java -jar ./compiler.jar ./Sections.js --jscomp_off=globalThis > ./min/Sections.js

echo " 8/$TOTAL BreadCrumbs"
java -jar ./compiler.jar ./BreadCrumbs.js --jscomp_off=globalThis > ./min/BreadCrumbs.js

echo " 9/$TOTAL sections/qservers/section"
java -jar ./compiler.jar ./sections/qservers/section.js --jscomp_off=globalThis > ./min/sections_qservers_section.js

echo "10/$TOTAL sections/bridge/section"
java -jar ./compiler.jar ./sections/bridge/section.js --jscomp_off=globalThis > ./min/sections_bridge_section.js

echo "11/$TOTAL sections/bridge/bb_rules/section"
java -jar ./compiler.jar ./sections/bridge/bb_rules/section.js --jscomp_off=globalThis > ./min/sections_bridge_bb_rules_section.js

echo "12/$TOTAL sections/bridge/cls_rules/section"
java -jar ./compiler.jar ./sections/bridge/cls_rules/section.js --jscomp_off=globalThis > ./min/sections_bridge_cls_rules_section.js

echo "13/$TOTAL sections/templates/list"
java -jar ./compiler.jar ./sections/templates/list.js --jscomp_off=globalThis > ./min/sections_templates_list.js

echo "14/$TOTAL sections/templates/edit"
java -jar ./compiler.jar ./sections/templates/edit.js --jscomp_off=globalThis > ./min/sections_templates_edit.js

echo "15/$TOTAL TopMenu"
java -jar ./compiler.jar ./TopMenu.js --jscomp_off=globalThis > ./min/TopMenu.js

echo "16/$TOTAL index"
java -jar ./compiler.jar ./index.js --jscomp_off=globalThis > ./min/index.js

echo "17/$TOTAL LoginExistHelper"
java -jar ./compiler.jar ./LoginExistHelper.js --jscomp_off=globalThis > ./min/LoginExistHelper.js

echo "18/$TOTAL sections/bridge/bb_rules/raw/section"
java -jar ./compiler.jar ./sections/bridge/bb_rules/raw/section.js --jscomp_off=globalThis > ./min/sections_bridge_bb_rules_raw_section.js

echo "19/$TOTAL sections/bridge/cls_rules/raw/section"
java -jar ./compiler.jar ./sections/bridge/cls_rules/raw/section.js --jscomp_off=globalThis > ./min/sections_bridge_cls_rules_raw_section.js

cat ./min/config.js ./min/md5.js ./min/cookie.js ./min/Class.js ./min/AJAX.js ./min/TopMenu.js ./min/auth.js ./min/Sections.js ./min/BreadCrumbs.js ./min/sections_qservers_section.js ./min/sections_bridge_section.js \
./min/LoginExistHelper.js ./min/sections_templates_list.js ./min/sections_templates_edit.js ./min/index.js \
./min/sections_bridge_bb_rules_section.js ./min/sections_bridge_cls_rules_section.js ./min/sections_bridge_bb_rules_raw_section.js ./min/sections_bridge_cls_rules_raw_section.js > ./all.min.js

# rm -rf ./min


