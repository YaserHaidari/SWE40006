
const { createApp } = Vue;

createApp({
  data() {
    return {
      // Filters for the table
      stuObj: {
        sCode: "",
        sDescription: "",
        UnitType: "" // "", "Core", or "Software Development"
      },

      // New subject form
      newSubject: {
        sCode: "",
        sDescription: "",
      
        UnitType: "Core"
      },

      // Table data
      marks: [],

      // UI state
      formError: "",
      formOk: false
    };
  },

  computed: {
    filterMarks() {
      const code = this.stuObj.sCode.trim().toLowerCase();
      const desc = this.stuObj.sDescription.trim().toLowerCase();
      const type = this.stuObj.UnitType;

      return this.marks.filter(m => {
        const okCode = !code || (m.sCode || "").toLowerCase().includes(code);
        const okDesc = !desc || (m.sDescription || "").toLowerCase().includes(desc);
        const okType = !type || m.UnitType === type;
        return okCode && okDesc && okType;
      });
    }
  },

  methods: {
    loadMarks() {
      try {
        const raw = localStorage.getItem("marks");
        this.marks = raw ? JSON.parse(raw) : [];
      } catch {
        this.marks = [];
      }
    },

    saveMarks() {
      localStorage.setItem("marks", JSON.stringify(this.marks));
    },

    resetNew() {
      this.newSubject = {
        sCode: "",
        sDescription: "",
      
        UnitType: "Core"
      };
      this.formError = "";
      this.formOk = false;
    },

    validateNew() {
      const ns = this.newSubject;
      if (!ns.sCode.trim()) return "Code is required.";
      if (!ns.sDescription.trim()) return "Description is required.";
     
      if (!ns.UnitType) return "Please choose a Unit Type.";

      // Prevent duplicate codes
      const dup = this.marks.some(m => (m.sCode || "").toLowerCase() === ns.sCode.trim().toLowerCase());
      if (dup) return "A subject with this code already exists.";

      return "";
    },

    addSubject() {
      this.formError = "";
      this.formOk = false;

      const err = this.validateNew();
      if (err) {
        this.formError = err;
        return;
      }

      // Push new item
      const clean = {
        sCode: this.newSubject.sCode.trim(),
        sDescription: this.newSubject.sDescription.trim(),
    
        UnitType: this.newSubject.UnitType
      };
      this.marks.push(clean);
      this.saveMarks();

      this.formOk = true;
      this.resetNew();
    },

    removeSubject(code) {
      const idx = this.marks.findIndex(m => m.sCode === code);
      if (idx >= 0) {
        this.marks.splice(idx, 1);
        this.saveMarks();
      }
    },

    clearAll() {
      if (confirm("Remove all subjects?")) {
        this.marks = [];
        this.saveMarks();
      }
    }
  },

  mounted() {
    this.loadMarks();

    // Optional: seed a couple of examples if empty
    if (this.marks.length === 0) {
      this.marks = [
        { sCode: "CMPUT301", sDescription: "Software Engineering", UnitType: "Software Development" },
        { sCode: "TNE30024", sDescription: "Telecom Engineering Project", UnitType: "Core" }
      ];
      this.saveMarks();
    }
  }
}).mount("#app");
