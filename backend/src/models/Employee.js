import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  joinDate: { type: String, required: true },
  status: { type: String, enum: ['active', 'flagged'], default: 'active' },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  password: { type: String, required: true },
}, { timestamps: true });

// Ensure virtual id getter (string) is available
EmployeeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret._id;
    return ret;
  },
});

const EmployeeDoc = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

export const EmployeeModel = {
  // Get all with filtering, sorting, and pagination
  getAll: async ({ filter = {}, sort = {}, limit, offset }) => {
    const query = {};
    if (filter.department) query.department = new RegExp(filter.department, 'i');
    if (filter.position) query.position = new RegExp(filter.position, 'i');
    if (filter.status) query.status = filter.status;
    if (filter.search) {
      const regex = new RegExp(filter.search, 'i');
      query.$or = [
        { name: regex },
        { email: regex },
        { department: regex },
        { position: regex },
      ];
    }

    const total = await EmployeeDoc.countDocuments(query);

    const findQuery = EmployeeDoc.find(query);
    if (sort.field) {
      const dir = sort.order === 'DESC' ? -1 : 1;
      findQuery.sort({ [sort.field]: dir });
    }
    if (offset !== undefined) findQuery.skip(offset);
    if (limit !== undefined) findQuery.limit(limit);

    const docs = await findQuery.lean();
    return { employees: docs.map(stripPassword), total };
  },

  getById: async (id) => {
    const doc = await EmployeeDoc.findById(id).lean();
    return doc ? stripPassword(doc) : null;
  },

  getByIds: async (ids) => {
    const docs = await EmployeeDoc.find({ _id: { $in: ids } }).lean();
    const map = new Map(docs.map(d => [String(d._id), stripPassword(d)]));
    return ids.map(id => map.get(String(id)) || null);
  },

  getByEmail: async (email) => {
    return await EmployeeDoc.findOne({ email }).lean();
  },

  create: async (employeeData) => {
    const doc = await EmployeeDoc.create({
      status: 'active',
      role: 'employee',
      ...employeeData,
    });
    const plain = doc.toObject();
    return stripPassword(plain);
  },

  update: async (id, updates) => {
    const doc = await EmployeeDoc.findByIdAndUpdate(id, updates, { new: true, lean: true });
    return doc ? stripPassword(doc) : null;
  },

  delete: async (id) => {
    const res = await EmployeeDoc.deleteOne({ _id: id });
    return res.deletedCount > 0;
  },
};

function stripPassword(doc) {
  const { password, _id, ...rest } = doc;
  // expose id as string
  return { id: String(_id), ...rest };
}
