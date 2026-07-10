fetch('https://api.github.com/repos/Sinxn-coder/weds/actions/runs')
  .then(r => r.json())
  .then(d => fetch(d.workflow_runs[0].jobs_url))
  .then(r => r.json())
  .then(d => {
     const jobId = d.jobs[0].id;
     return fetch(`https://api.github.com/repos/Sinxn-coder/weds/actions/jobs/${jobId}/logs`);
  })
  .then(r => r.text())
  .then(t => console.log(t))
  .catch(e => console.error(e));
