try {
  printjson("Script started");
  function createDatabase(dbName) {
    const targetDB = db.getSiblingDB(dbName);
    targetDB.createCollection("__init__");
    print(`✅ Database '${dbName}' initialized`);
  }

  createDatabase("fish_db");
  createDatabase("fish_db_test");
  printjson("Script end");
} catch (e) {
  printjson("ERROR: " + e);
}
