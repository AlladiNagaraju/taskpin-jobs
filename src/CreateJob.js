import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { deleteJob, fetchData, postJob, updateJob } from "./services";
import { intialJobApplication, intialJobApplicationError } from "./constants";

function CreateJob() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState();
  const [openStepTwo, setOpenStepTwo] = useState(false);
  const [jobApplicationError, setJobApplicationError] = useState(
    intialJobApplicationError
  );
  const [jobApplication, setJobApplication] = useState(intialJobApplication);

  
  function closeModal() {
    setIsOpen(false);
    setJobApplicationError(intialJobApplicationError);
  }

  function openModal() {
    setIsOpen(true);
    setOpenStepTwo(false);
    setJobApplication(intialJobApplication);
    setJobApplicationError({ ...jobApplicationError, applyTypeError: false });
  }

  function handleStepOneValidation() {
    let validation = {
      jobTitleError: false,
      companyNameError: false,
      industryError: false,
      applyTypeError: false,
    };

    let isValidJobTitle = jobApplication.jobTitle.trim().length;
    if (!isValidJobTitle) {
      validation.jobTitleError = true;
    } else {
      validation.jobTitleError = false;
    }

    let isCompanyNameValidate = jobApplication.companyName.trim().length;
    if (!isCompanyNameValidate) {
      validation.companyNameError = true;
    } else {
      validation.companyNameError = false;
    }
    let isValidateIndustry = jobApplication.industry.trim().length;
    if (!isValidateIndustry) {
      validation.industryError = true;
    } else {
      validation.industryError = false;
    }

    setJobApplicationError(validation);

    if (isValidJobTitle && isCompanyNameValidate && isValidateIndustry) {
      setOpenStepTwo(true);
    } else {
      setOpenStepTwo(false);
    }
  }

  const handleJobApplicationChange = (e) => {
    let value = e.target.value;
    setJobApplication({ ...jobApplication, [e.target.name]: value });
  };

  function handleJobApplication() {
    let validateApplyType = jobApplication.applyType.length;

    if (validateApplyType) {
      setJobApplicationError({ ...jobApplicationError, applyTypeError: false });
      if (jobApplication.id) {
        updatingJob();
      } else {
        postingJob();
      }
    } else {
      setJobApplicationError({ ...jobApplicationError, applyTypeError: true });
    }
  }

  const fetchDataFromApi = async () => {
    const result = await fetchData();
    setJobs(result);
  };

  const postingJob = async () => {
    const result = await postJob(jobApplication);
    if (result) {
      fetchDataFromApi();
      setIsOpen(false);
      setJobApplication(intialJobApplication);
      setOpenStepTwo(false);
    }
  };

  const updatingJob = async () => {
    const result = await updateJob(jobApplication.id, jobApplication);
    if (result) {
      fetchDataFromApi();
      setOpenStepTwo(false);
      setIsOpen(false);
    }
  };

  const openEditModal = (job) => {
    setOpenStepTwo(false);
    setJobApplication(job);
    setIsOpen(true);
  };

  const deletingJob = async (job) => {
    const result = await deleteJob(job.id);
    if (result) {
      setJobApplication(intialJobApplication);
      fetchDataFromApi();
    }
  };

  function handlingSalary(num) {
    if (Number(num) > 999 && Number(num) <= 9999) {
      const changeNum = num.slice(0, 1) + "," + num.slice(1);
      return changeNum;
    } else if (Number(num) > 0 && Number(num) <= 999) {
      return num;
    } else if (Number(num) >= 10000 && Number(num) <= 99999) {
      const changeNum = num.slice(0, 2) + "," + num.slice(2);
      return changeNum;
    }
  }

  useEffect(() => {
    fetchDataFromApi();
  }, []);

  return (
    <div className="p-5 font-poppins">
      <div>
        <div>
          <button
            onClick={openModal}
            className="bg-primary text-white px-5 py-2.5 text-center rounded-full font-medium"
          >
            Create Job
          </button>

          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10 font-poppins"
              onClose={closeModal}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-popup transform border-lightGray overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium leading-6 text-darkBlack">
                          Create a Job
                        </h3>
                        <p className="text-darkBlack">
                          Step {openStepTwo ? 2 : 1}
                        </p>
                      </div>

                      {openStepTwo === false ? (
                        <div>
                          <div className="pt-6">
                            <label
                              className="block text-dark text-sm font-bold mb-1"
                              for="jobTitle"
                            >
                              Job Title<span className="text-red-900">*</span>
                            </label>
                            <input
                              className="appearance-none border rounded w-full py-2 px-3 text-dark h-9 placeholder-lightDark"
                              name="jobTitle"
                              type="text"
                              placeholder="ex. UX UI Designer"
                              value={jobApplication.jobTitle}
                              onChange={handleJobApplicationChange}
                            />
                            {jobApplicationError.jobTitleError && (
                              <p className="text-error text-xs ">
                                Please Enter Job title
                              </p>
                            )}
                          </div>

                          <div className="pt-6">
                            <label
                              className="block text-dark text-sm font-bold mb-1"
                              for="companyName"
                            >
                              Company name
                              <span className="text-red-900">*</span>
                            </label>
                            <input
                              className="appearance-none border rounded w-full py-2 px-3 text-dark h-9 placeholder-lightDark"
                              name="companyName"
                              type="text"
                              placeholder="ex. Google"
                              value={jobApplication.companyName}
                              onChange={handleJobApplicationChange}
                            />
                            {jobApplicationError.companyNameError && (
                              <p className="text-error text-xs ">
                                Please Enter Company name
                              </p>
                            )}
                          </div>

                          <div className="pt-6">
                            <label
                              className="block text-dark text-sm font-bold mb-1"
                              for="industry"
                            >
                              Industry<span className="text-red-900">*</span>
                            </label>
                            <input
                              className="appearance-none border rounded w-full py-2 px-3 text-dark h-9 placeholder-lightDark"
                              name="industry"
                              type="text"
                              placeholder="ex. Information Technology"
                              value={jobApplication.industry}
                              onChange={handleJobApplicationChange}
                            />
                            {jobApplicationError.industryError && (
                              <p className="text-error text-xs ">
                                Please Enter Industry
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-5 pt-6">
                            <div>
                              <label
                                className="block text-dark text-sm font-bold mb-1"
                                for="location"
                              >
                                Location
                              </label>
                              <input
                                className="appearance-none border rounded py-2 px-3 text-dark h-9 w-full placeholder-lightDark"
                                name="location"
                                type="text"
                                placeholder="ex. Chennai"
                                value={jobApplication.location}
                                onChange={handleJobApplicationChange}
                              />
                            </div>

                            <div>
                              <label
                                className="block text-dark text-sm font-bold mb-1"
                                for="remoteType"
                              >
                                Remote type
                              </label>
                              <input
                                className="appearance-none border rounded py-2 px-3 text-dark h-9 w-full placeholder-lightDark"
                                name="remoteType"
                                type="text"
                                placeholder="ex. In-office"
                                value={jobApplication.remoteType}
                                onChange={handleJobApplicationChange}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="pt-6">
                            <label
                              className="block text-dark text-sm font-bold mb-1"
                              for="experience"
                            >
                              Experience
                            </label>
                            <div className="grid grid-cols-2 gap-5">
                              <input
                                className="appearance-none border rounded py-2 px-3 text-dark h-9 w-full placeholder-lightDark"
                                name="minimumExpirenece"
                                type="number"
                                min="0"
                                placeholder="Minimum"
                                value={jobApplication.minimumExpirenece}
                                onChange={handleJobApplicationChange}
                              />

                              <input
                                className="appearance-none border rounded py-2 px-3 text-dark h-9 w-full"
                                name="maximumExpirenece"
                                type="number"
                                min="0"
                                placeholder="Maximum"
                                value={jobApplication.maximumExpirenece}
                                onChange={handleJobApplicationChange}
                              />
                            </div>
                          </div>

                          <div className="pt-6">
                            <label
                              className="block text-dark text-sm font-bold mb-1"
                              for="salary"
                            >
                              Salary
                            </label>
                            <div className="grid grid-cols-2 gap-5">
                              <input
                                className="appearance-none border rounded py-2 px-3 text-dark h-9 w-full placeholder-lightDark"
                                name="minimumSalary"
                                type="number"
                                min="0"
                                placeholder="Minimum"
                                value={jobApplication.minimumSalary}
                                onChange={handleJobApplicationChange}
                              />

                              <input
                                className="appearance-none border rounded py-2 px-3 text-dark h-9 w-full placeholder-lightDark"
                                name="maximumSalary"
                                type="number"
                                min="0"
                                placeholder="Maximum"
                                value={jobApplication.maximumSalary}
                                onChange={handleJobApplicationChange}
                              />
                            </div>
                          </div>

                          <div className="pt-6">
                            <label
                              className="block text-dark text-sm font-bold mb-1"
                              for="totalEmployee"
                            >
                              Total employee
                            </label>
                            <input
                              className="appearance-none border rounded w-full py-2 px-3 text-dark h-9 placeholder-lightDark"
                              name="totalEmployee"
                              type="number"
                              min="0"
                              placeholder="ex. 100"
                              value={jobApplication.totalEmployee}
                              onChange={handleJobApplicationChange}
                            />
                          </div>

                          <div className="pt-6">
                            <p className="block text-dark text-sm font-bold mb-1">
                              Apply type
                            </p>
                            <div>
                              <input
                                type="radio"
                                name="applyType"
                                value="applyNow"
                                className="mr-1"
                                onChange={handleJobApplicationChange}
                                checked={
                                  jobApplication.applyType === "applyNow"
                                }
                              />
                              <label className="text-dark text-sm pr-4">
                                Quick apply
                              </label>
                               
                              <input
                                type="radio"
                                name="applyType"
                                value="externalApply"
                                onChange={handleJobApplicationChange}
                                checked={
                                  jobApplication.applyType === "externalApply"
                                }
                                className="mr-1"
                              />
                              <label className="text-dark text-sm">
                                External apply
                              </label>
                               
                            </div>
                            {jobApplicationError.applyTypeError && (
                              <p className="text-error text-xs ">
                                Please select the Apply type
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between pt-24">
                        <div></div>
                        {openStepTwo ? (
                          <button
                            onClick={handleJobApplication}
                            className="bg-blue-500 text-white px-5 py-2.5 text-center rounded-full font-medium"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={handleStepOneValidation}
                            className="bg-blue-500 text-white px-5 py-2.5 text-center rounded-full font-medium"
                          >
                            Next
                          </button>
                        )}
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {jobs?.map((job) => (
          <div class="rounded-xl overflow-hidden shadow-lg p-4">
            <div className="flex">
              <div className="w-12 h-12 rounded overflow-hidden">
                <img
                  classname="w-full h-full object-cover"
                  src="https://www.google.com/url?sa=i&url=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZ5Dh8WKZetysVs6vceT6Fw21mYlEMHFw778Qz7co&s%3A%2F%2Fwww.facebook.com%2Fnetflix%2F&psig=AOvVaw3tajhw3FXSBlTet0L-BLK1&ust=1700284413591000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCIin7JWjyoIDFQAAAAAdAAAAABAE"
                  alt="Netflix"
                />
              </div>
              <div
                className="w-full h-full
               ml-2"
              >
                <div>
                  <div className="flex justify-between items-top">
                    <div className="font-bold text-lightBlack text-xl">
                      {job.jobTitle}
                    </div>
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 mr-3 cursor-pointer"
                        onClick={() => openEditModal(job)}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                        />
                      </svg>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => deletingJob(job)}
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-lightBlack text-base">
                    {job.companyName} - {job.industry}
                  </p>
                  {job.location && (
                    <p className="text-lightDark text-base mb-6">
                      {job.location ? job.location : "Chennai"}&nbsp;(In-office)
                    </p>
                  )}

                  <p className="text-mediumDark text-base pb-2">
                    Part-Time (9.00 am - 5.00 pm IST)
                  </p>
                  {(job.minimumExpirenece || job.maximumExpirenece) && (
                    <p className="text-mediumDark text-base pb-2">
                      Experience ({job.minimumExpirenece} -{" "}
                      {job.maximumExpirenece} years)
                    </p>
                  )}
                  {(job.minimumSalary || job.maximumSalary) && (
                    <p className="text-mediumDark text-base pb-2">
                      INR (₹) {handlingSalary(job.minimumSalary)} -{" "}
                      {handlingSalary(job.maximumSalary)} / Month
                    </p>
                  )}

                  {job.totalEmployee && (
                    <p className="text-mediumDark text-base pb-2">
                      {job.totalEmployee} employees
                    </p>
                  )}

                  {job.applyType === "applyNow" && (
                    <button className="bg-primary  border-primary text-white px-4 py-2 text-center rounded-md font-medium mt-6">
                      Apply Now
                    </button>
                  )}

                  {job.applyType === "externalApply" && (
                    <button className="bg-transparent text-primary font-medium py-2 px-4 border border-primary  rounded-md mt-6">
                      External Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateJob;
