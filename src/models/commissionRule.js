class CommissionRule {
  constructor({
    id,
    name,
    type,
    value,
    isActive = false,
    createdAt = new Date(),
    updatedAt = new Date(),
    createdBy
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.value = value;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.createdBy = createdBy;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      value: this.value,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy
    };
  }

  static fromJSON(json) {
    return new CommissionRule(json);
  }

  calculateCommission(amount) {
    if (this.type === 'percentage') {
      return (amount * this.value) / 100;
    }
    return this.value;
  }
}

export default CommissionRule; 