'use client';
import DoubleHeader from "@/app/components/DoubleHeader";
import NewKeywordForm from "@/app/components/NewKeywordForm";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteButton from "@/app/components/DeleteButton";
import KeywordRow from "@/app/components/KeywordRow";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function DomainPage(props) {
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();
  const domain = props.params.domain;

  useEffect(() => {
    fetchKeywords();
  }, []);

  function fetchKeywords() {
    setLoading(true);
    setError(null);
    axios.get('/api/keywords?domain=' + domain)
      .then(response => {
        setKeywords(response.data.keywords);
        setResults(response.data.results);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching keywords:", error);
        setError("Failed to fetch keywords. Please try again later.");
        setLoading(false);
      });
  }

  function deleteDomain() {
    axios.delete('/api/domains?domain=' + domain)
      .then(() => {
        router.push('/');
      })
      .catch(error => {
        console.error("Error deleting domain:", error);
        setError("Failed to delete domain. Please try again later.");
      });
  }

  function showDeletePopup() {
    MySwal.fire({
      title: 'Delete?',
      text: `Do you want to delete ${domain}?`,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      confirmButtonColor: '#f00',
      showCloseButton: true,
      showCancelButton: true,
      reverseButtons: true,
      focusCancel: true,
      focusConfirm: false,
    }).then(result => {
      if (result.isConfirmed) {
        deleteDomain();
      }
    });
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex items-end">
        <DoubleHeader preTitle={'Domains »'} preTitleLink={'/'} mainTitle={domain} />
        <div className="p-2">
          <DeleteButton onClick={showDeletePopup} />
        </div>
      </div>
      <NewKeywordForm
        domain={domain}
        onNew={fetchKeywords}
        onSavingStarted={() => setLoading(true)}
      />
      {loading && <div>Loading...</div>}
      {!loading && keywords.map(keywordDoc => (
        <KeywordRow
          {...keywordDoc}
          key={keywordDoc._id}
          results={results.filter(r => r.keyword === keywordDoc.keyword)}
        />
      ))}
      {!loading && !keywords?.length && (
        <div>No keywords found. Try adding a new keyword!</div>
      )}
    </div>
  );
}
