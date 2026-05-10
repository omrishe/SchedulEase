import { useState, useEffect } from "react";
import {
  addServiceToStore,
  fetchStoreData,
  adminDelService,
  adminEditService,
} from "../services/storeService.js";
import { ServiceForm } from "./ServiceForm";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "../utils/errorHandling.js";

export default function ServicesSection({ userAuthData }) {
  const [formData, setFormaData] = useState([
    {
      formId: uuidv4(),
      name: "",
      price: "",
      serviceNote: "",
    },
  ]);

  const [message, setMessage] = useState("");
  const [storeSrv, setStoreSvc] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceSelected, setServiceSelected] = useState();
  // editData holds the fields being edited: { srvId, name, price, serviceNote }
  const [editData, setEditData] = useState(null);

  // Fetch services on mount
  useEffect(() => {
    async function getServices() {
      setIsLoading(true);
      const serverResponse = await fetchStoreData(userAuthData);
      if (serverResponse.isSuccess) {
        setStoreSvc(serverResponse.otherData);
      }
      setIsLoading(false);
    }
    getServices();
  }, []);

  // Add service to the store
  async function addService(e) {
    e.preventDefault();
    const response = await addServiceToStore(
      userAuthData,
      formData.map((svc) => ({
        price: svc.price,
        name: svc.name,
        serviceNote: svc.serviceNote,
      })),
    );
    if (!response.isSuccess) {
      setMessage(getErrorMessage(response.code));
    } else {
      setMessage(response.message);
    }
    return;
  }

  // Add another service form to the page
  function addAnotherServiceForm() {
    setFormaData((prev) => [
      ...prev,
      {
        formId: uuidv4(),
        name: "",
        price: "",
        serviceNote: "",
      },
    ]);
  }

  // Handle service clicked (toggle selection)
  function onServiceClicked(service) {
    if (serviceSelected?.srvId === service.srvId) {
      setServiceSelected();
      setEditData(null);
    } else {
      setServiceSelected(service);
      setEditData(null); // clear edit mode when switching selection
    }
  }

  // Open edit mode — pre-fill form with selected service's values
  function onEditSrvClicked() {
    setEditData({
      srvId: serviceSelected.srvId,
      name: serviceSelected.name,
      price: serviceSelected.price,
      serviceNote: serviceSelected.serviceNote,
    });
  }

  // Handle changes inside the inline edit form
  function handleEditInputChange(e) {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  // Submit the edit to the server
  async function submitEdit(e) {
    e.preventDefault();
    const serverResponse = await adminEditService(
      userAuthData.storeId,
      editData.srvId,
      {
        name: editData.name,
        price: editData.price,
        serviceNote: editData.serviceNote,
      },
    );
    if (serverResponse.isSuccess) {
      setStoreSvc(serverResponse.otherData);
      setMessage(serverResponse.message);
      setEditData(null);
      setServiceSelected(null);
    } else {
      setMessage(getErrorMessage(serverResponse.code));
    }
  }

  // Cancel edit mode
  function cancelEdit() {
    setEditData(null);
  }

  // Handle form input component change (for Add form)
  function handleInputChange(e, formId) {
    setFormaData((prev) =>
      prev.map((svc) =>
        svc.formId === formId
          ? { ...svc, [e.target.name]: e.target.value }
          : svc,
      ),
    );
  }

  // Handle deleting service
  async function deleteSelectedService() {
    const serverResponse = await adminDelService(
      serviceSelected.srvId,
      userAuthData.storeId,
    );
    if (serverResponse.isSuccess) {
      setStoreSvc(serverResponse.otherData);
      setMessage(serverResponse.message);
      setServiceSelected(null);
    } else {
      setMessage(getErrorMessage(serverResponse.code));
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-section-header">
        <span className="admin-section-icon">✂️</span>
        <h2 className="admin-section-title">Store Services</h2>
      </div>
      <p className="admin-section-desc">
        View, add, or remove services offered at your store.
      </p>
      <div className="admin-services-layout">
        {/* Existing services list */}
        <div className="admin-services-list">
          <h3 className="admin-subsection-title">Current Services</h3>
          <div className="scrollableMenu">
            {isLoading ? (
              <ServiceCardSkeleton count={4} />
            ) : (
              <>
                {storeSrv.map((service) => (
                  <button
                    key={service.srvId}
                    className={`serviceBtn${serviceSelected?.srvId === service.srvId ? " selected" : ""}`}
                    onClick={() => onServiceClicked(service)}
                  >
                    <span className="serviceName">{service.name}</span>
                    <span className="servicePrice">{service.price}</span>
                    <span className="serviceNote">{service.serviceNote}</span>
                  </button>
                ))}
                {storeSrv.length === 0 && (
                  <span className="admin-empty-state">
                    No services added yet.
                  </span>
                )}
              </>
            )}
          </div>
          {serviceSelected && (
            <div className="admin-service-actions">
              <button className="admin-edit-btn" onClick={onEditSrvClicked}>
                ✏️ Edit "{serviceSelected.name}"
              </button>
              <button
                className="admin-delete-btn"
                onClick={deleteSelectedService}
              >
                🗑 Delete "{serviceSelected.name}"
              </button>
            </div>
          )}
        </div>

        {/* Right panel: inline edit form OR add new service form */}
        <div className="admin-services-form-wrapper">
          {editData ? (
            <>
              <h3 className="admin-subsection-title">Edit "{editData.name}"</h3>
              <form className="form" onSubmit={submitEdit}>
                <div className="singleForm">
                  <label htmlFor="edit-name">service name</label>
                  <input
                    id="edit-name"
                    name="name"
                    value={editData.name}
                    onChange={handleEditInputChange}
                  />
                  <label htmlFor="edit-price">service price</label>
                  <input
                    id="edit-price"
                    name="price"
                    value={editData.price}
                    onChange={handleEditInputChange}
                  />
                  <label htmlFor="edit-note">service note</label>
                  <input
                    id="edit-note"
                    name="serviceNote"
                    value={editData.serviceNote}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-add-form-btn"
                    onClick={cancelEdit}
                    title="Cancel edit"
                  >
                    ✕
                  </button>
                  <button className="admin-submit-btn" type="submit">
                    Save changes
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h3 className="admin-subsection-title">Add New Service</h3>
              <form className="form" onSubmit={addService}>
                {formData.map((formValues) => (
                  <ServiceForm
                    key={formValues.formId}
                    className={"singleForm"}
                    formValues={formValues}
                    handleInputChange={handleInputChange}
                  ></ServiceForm>
                ))}
                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-add-form-btn"
                    onClick={addAnotherServiceForm}
                    title="Add another service"
                  >
                    +
                  </button>
                  <button
                    className="admin-submit-btn"
                    type="submit"
                  >{`Add service${formData.length > 1 ? "s" : ""}`}</button>
                </div>
              </form>
            </>
          )}
          {message && <div className="admin-message">{message}</div>}
        </div>
      </div>
    </section>
  );
}
