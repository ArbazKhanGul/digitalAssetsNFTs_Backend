const AdminData = require('./adminData');

async function ensureDefaultBuyOptions() {
  try {
    const existingOptions = await AdminData.findOne();
    if (!existingOptions) {
      await AdminData.create({});
      console.log('Default AdminData document created.');
    } else {
      console.log('AdminData document already exists.');
    }
  } catch (error) {
    console.error('Error ensuring default AdminData:', error);
  }
}

module.exports = ensureDefaultBuyOptions;
