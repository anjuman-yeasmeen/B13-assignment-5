const issuesContainer = document.getElementById("issues-container");
const issueCountElement = document.getElementById("issue-count");
const loader = document.getElementById("loader");

async function loadCategories() {
    try {
        
        loader.style.display = "flex";
        issuesContainer.innerHTML = ""; 

        const res = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
        const data = await res.json();
        
        const issues = data.data || data;

        if (Array.isArray(issues)) {
            issueCountElement.innerText = `${issues.length} Issues`;

            issues.forEach(issue => {
                const isStatusOpen = issue.status?.toLowerCase() === "open";
                const statusIcon = isStatusOpen ? "./assets/Open-Status.png" : "./assets/Closed- Status .png";
            
                
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
                                ${issue.description || 'No description available for this issue.'}
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
                            <p class="hover:underline hover:text-slate-700">#${issue.id || '00'} by <span class="font-medium text-slate-600">${issue.user_name || 'anonymous'}</span></p>
                            <p>${issue.posted_date || 'Date N/A'}</p>
                        </div>
                    </div>
                `;
                
                issuesContainer.appendChild(card);
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        issuesContainer.innerHTML = `<p class="col-span-full text-center text-red-500 py-10">Failed to load data.</p>`;
    } finally {
        
        loader.style.display = "none";
    }
}

loadCategories();