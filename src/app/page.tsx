"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";

type Subject = {
  sCode: string;
  sDescription: string;
  UnitType: string;
};

export default function Home() {
  const [marks, setMarks] = useState<Subject[]>([]);

  const [stuObj, setStuObj] = useState({
    sCode: "",
    sDescription: "",
    UnitType: "" as "" | "Core" | "Software Development",
  });

  const [newSubject, setNewSubject] = useState<Subject>({
    sCode: "",
    sDescription: "",
    UnitType: "Core",
  });

  const [formError, setFormError] = useState("");
  const [formOk, setFormOk] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("marks");
      const parsed = raw ? JSON.parse(raw) : [];
      setMarks(parsed);
    } catch {
      setMarks([]);
    }
  }, []);

  useEffect(() => {
    // seed if empty
    if (marks.length === 0) {
      const seeded: Subject[] = [
        { sCode: "CMPUT301", sDescription: "Software Engineering", UnitType: "Software Development" },
        { sCode: "TNE30024", sDescription: "Telecom Engineering Project", UnitType: "Core" },
      ];
      setMarks(seeded);
      localStorage.setItem("marks", JSON.stringify(seeded));
    }
  }, [marks.length]);

  const saveMarks = (next: Subject[]) => {
    setMarks(next);
    localStorage.setItem("marks", JSON.stringify(next));
  };

  const resetNew = () => {
    setNewSubject({ sCode: "", sDescription: "", UnitType: "Core" });
    setFormError("");
    setFormOk(false);
  };

  const validateNew = () => {
    const ns = newSubject;
    if (!ns.sCode.trim()) return "Code is required.";
    if (!ns.sDescription.trim()) return "Description is required.";
    if (!ns.UnitType) return "Please choose a Unit Type.";
    const dup = marks.some(m => (m.sCode || "").toLowerCase() === ns.sCode.trim().toLowerCase());
    if (dup) return "A subject with this code already exists.";
    return "";
  };

  const addSubject = () => {
    setFormError("");
    setFormOk(false);
    const err = validateNew();
    if (err) {
      setFormError(err);
      return;
    }
    const clean: Subject = {
      sCode: newSubject.sCode.trim(),
      sDescription: newSubject.sDescription.trim(),
      UnitType: newSubject.UnitType,
    };
    const next = [...marks, clean];
    saveMarks(next);
    setFormOk(true);
    resetNew();
  };

  const removeSubject = (code: string) => {
    const next = marks.filter(m => m.sCode !== code);
    saveMarks(next);
  };

  const clearAll = () => {
    if (confirm("Remove all subjects?")) {
      saveMarks([]);
    }
  };

  const filterMarks = useMemo(() => {
    const code = stuObj.sCode.trim().toLowerCase();
    const desc = stuObj.sDescription.trim().toLowerCase();
    const type = stuObj.UnitType;
    return marks.filter(m => {
      const okCode = !code || (m.sCode || "").toLowerCase().includes(code);
      const okDesc = !desc || (m.sDescription || "").toLowerCase().includes(desc);
      const okType = !type || m.UnitType === type;
      return okCode && okDesc && okType;
    });
  }, [marks, stuObj]);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="container">
          <div className="row mb-3">
            <h2>Application</h2>
          </div>

          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="card-title">Add Subject</h5>
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <label htmlFor="nsCode" className="form-label">Code</label>
                      <input id="nsCode" className="form-control" value={newSubject.sCode} onChange={e => setNewSubject({ ...newSubject, sCode: e.target.value })} placeholder="e.g. SWE40006" />
                    </div>
                    <div className="col-sm-8">
                      <label htmlFor="nsDesc" className="form-label">Description</label>
                      <input id="nsDesc" className="form-control" value={newSubject.sDescription} onChange={e => setNewSubject({ ...newSubject, sDescription: e.target.value })} placeholder="e.g. Software Deployment" />
                    </div>

                    <div className="col-sm-8">
                      <label className="form-label d-block">Unit Type</label>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="nsCore" value="Core" checked={newSubject.UnitType === "Core"} onChange={() => setNewSubject({ ...newSubject, UnitType: "Core" })} />
                        <label className="form-check-label" htmlFor="nsCore">Core</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" id="nsSD" value="Software Development" checked={newSubject.UnitType === "Software Development"} onChange={() => setNewSubject({ ...newSubject, UnitType: "Software Development" })} />
                        <label className="form-check-label" htmlFor="nsSD">Software Development</label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-primary" onClick={addSubject}>Add Subject</button>
                    <button className="btn btn-outline-secondary" onClick={resetNew}>Reset</button>
                  </div>
                  {formError && <p className="text-danger mt-2">{formError}</p>}
                  {formOk && <p className="text-success mt-2">Subject added.</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-8">
              <label className="form-label d-block">Unit Type</label>
              <div className="form-check form-check-inline">
                <input type="radio" id="Core" className="form-check-input" value="Core" checked={stuObj.UnitType === "Core"} onChange={() => setStuObj({ ...stuObj, UnitType: "Core" })} />
                <label className="form-check-label" htmlFor="Core">Core</label>
              </div>
              <div className="form-check form-check-inline">
                <input type="radio" id="SoftwareDevelopment" className="form-check-input" value="Software Development" checked={stuObj.UnitType === "Software Development"} onChange={() => setStuObj({ ...stuObj, UnitType: "Software Development" })} />
                <label className="form-check-label" htmlFor="SoftwareDevelopment">Software Development</label>
              </div>
              <div className="form-check form-check-inline">
                <input type="radio" id="All" className="form-check-input" value="" checked={stuObj.UnitType === ""} onChange={() => setStuObj({ ...stuObj, UnitType: "" })} />
                <label className="form-check-label" htmlFor="All">All</label>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Type</th>
                    <th style={{ width: "1%" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filterMarks.map((m, idx) => (
                    <tr key={`${m.sCode}-${idx}`}>
                      <td>{m.sCode}</td>
                      <td>{m.sDescription}</td>
                      <td>{m.UnitType}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeSubject(m.sCode)} title="Remove">✕</button>
                      </td>
                    </tr>
                  ))}
                  {filterMarks.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-muted text-center py-4">No subjects yet. Add one above.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between">
              <small className="text-muted">Total subjects: {marks.length}</small>
              <button className="btn btn-sm btn-outline-secondary" onClick={clearAll} disabled={marks.length === 0}>Clear All</button>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer} />
    </div>
  );
}
