const issuesContainer = document.getElementById("issues-container");
const issueCountElement = document.getElementById("issue-count");
const loader = document.getElementById("loader");
const issueModal = document.getElementById("issue_modal");
const modalContent = document.getElementById("modal-content");


async function loadCategories() {
    try {
        loader.style.display = "flex";
        issuesContainer.innerHTML = ""; 

        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const responseData = await res.json();
        const issues = responseData.data || responseData;

        if (Array.isArray(issues)) {
            issueCountElement.innerText = `${issues.length} Issues`;

            issues.forEach(issue => {
                const isStatusOpen = issue.status?.toLowerCase() === "open";
                const statusIcon = isStatusOpen ? "./assets/Open-Status.png" : "./assets/Closed-Status.png";
                const borderColor = isStatusOpen ? "border-t-emerald-500" : "border-t-[#A855F7]";
                const bgIconColor = isStatusOpen ? "bg-emerald-50" : "bg-purple-50";

                const card = document.createElement("div");
                card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 ${borderColor} rounded-xl transition-all hover:shadow-md cursor-pointer h-full`;

                card.innerHTML = `
                    <div class="card-body p-5 flex flex-col gap-4">
                        <div class="flex justify-between items-center">
                            <div class="w-10 h-10 rounded-full ${bgIconColor} flex items-center justify-center border border-gray-100">
                                <img src="${statusIcon}" class="w-6 h-6" alt="Status Icon">
                            </div>
                            <div class="badge bg-red-50 text-red-600 border border-red-100 font-medium px-4 py-3 rounded-full text-xs uppercase tracking-wider">
                                ${issue.priority || 'High'}
                            </div>
                        </div>

                        <div class="space-y-2 flex-grow">
                            <h3 class="text-xl font-bold text-slate-800 hover:text-[#A855F7] leading-snug line-clamp-2">
                                ${issue.title}
                            </h3>
                            <p class="text-sm text-gray-500 line-clamp-3">
                                ${issue.description || 'No description available.'}
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
                            <div class="badge bg-red-50 text-red-600 border border-red-100 font-medium px-3 py-2 rounded-full text-xs">
                                <img src="./assets/bug.png" class="mr-1 w-4" alt="bug"> Bug
                            </div>
                            <div class="badge bg-amber-50 text-amber-700 border border-amber-100 font-medium px-3 py-2 rounded-full text-xs">
                                <img src="./assets/help.png" class="mr-1 w-4" alt="help"> Help Wanted
                            </div>
                        </div>

                        <div class="text-sm text-gray-400 mt-2 space-y-1">
                            <p class="hover:underline hover:text-slate-700">#${issue.id} by <span class="font-medium text-slate-600">${issue.user_name || issue.author}</span></p>
                            <p>${issue.posted_date || new Date(issue.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;

                card.onclick = () => fetchSingleIssue(issue.id);
                issuesContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error:", error);
        issuesContainer.innerHTML = `<p class="col-span-full text-center text-red-500 py-10">Data load failed.</p>`;
    } finally {
        loader.style.display = "none";
    }
}


async function fetchSingleIssue(id) {
    try {
        modalContent.innerHTML = `<div class="flex justify-center py-24"><span class="loading loading-spinner loading-lg text-[#5800FF]"></span></div>`;
        issueModal.showModal();

        const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`);
        const responseData = await res.json();
        const issue = responseData.data;

        const date = new Date(issue.createdAt).toLocaleDateString('en-GB');

        modalContent.innerHTML = `
            <div class="p-10 relative">
                <div class="space-y-3">
                    <h2 class="text-3xl font-extrabold text-slate-900 tracking-tight">${issue.title}</h2>
                    <div class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                        <span class="bg-[#00ab66] text-white px-4 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <i class="fa-solid fa-circle-dot"></i> ${issue.status === 'open' ? 'Opened' : 'Closed'}
                        </span>
                        <span>•</span>
                        <span>Opened by <span class="font-bold text-slate-700">${issue.author}</span></span>
                        <span>•</span>
                        <span>${date}</span>
                    </div>
                </div>

                <div class="flex gap-2 mt-8">
                    <span class="bg-red-50 text-[#ff4d4d] border border-red-100 px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1.5 uppercase tracking-widest">
                        <i class="fa-solid fa-tag"></i> ${issue.labels && issue.labels[0] ? issue.labels[0].toUpperCase() : 'BUG'}
                    </span>
                    <span class="bg-orange-50 text-[#f59e0b] border border-orange-100 px-3 py-1.5 rounded-lg text-[11px] font-black flex items-center gap-1.5 uppercase tracking-widest">
                        <i class="fa-solid fa-hand-holding-heart"></i> HELP WANTED
                    </span>
                </div>

                <div class="mt-10">
                    <p class="text-slate-600 leading-relaxed text-[17px] font-medium">
                        ${issue.description}
                    </p>
                </div>

                <div class="mt-12 flex justify-between items-center bg-slate-50/80 p-8 rounded-2xl border border-slate-100">
                    <div>
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Assignee:</p>
                        <p class="text-xl font-black text-slate-800">${issue.assignee || 'Not Assigned'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Priority:</p>
                        <div class="bg-[#ff4d4d] text-white px-6 py-1.5 rounded-full text-[11px] font-black shadow-lg shadow-red-100 inline-block tracking-[0.2em]">
                            ${issue.priority ? issue.priority.toUpperCase() : 'HIGH'}
                        </div>
                    </div>
                </div>

                <div class="mt-10 flex justify-end">
                    <form method="dialog">
                        <button class="bg-[#6000ff] hover:bg-[#5000d6] text-white px-10 py-3 rounded-xl font-black text-sm transition-all shadow-xl shadow-indigo-100 active:scale-95">
                            Close
                        </button>
                    </form>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Error:", error);
        modalContent.innerHTML = `<p class="p-10 text-red-500 font-bold text-center">Failed to load details.</p>`;
    }
}

loadCategories();