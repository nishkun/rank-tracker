'use client';
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Chart from "@/app/components/Chart";
import DeleteButton from "@/app/components/DeleteButton";
import DoubleHeader from "@/app/components/DoubleHeader";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function KeywordPage(props) {
  const keyword = decodeURIComponent(props.params.keyword);
  const domain = props.params.domain;
  const router = useRouter();
  const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get('/api/keywords?keyword=' + keyword + '&domain=' + domain)
      .then(response => setResults(response.data.results));
  }, [keyword, domain]);

  async function deleteKeyword() {
    await axios.delete('/api/keywords?domain=' + domain + '&keyword=' + encodeURIComponent(keyword));
    router.push('/domains/' + domain);
  }

  function showDeletePopup() {
    MySwal.fire({
      title: 'Delete?',
      text: `Do you want to delete "${keyword}"?`,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Delete',
      confirmButtonColor: '#f00',
      showCancelButton: true,
      showCloseButton: true,
      reverseButtons: true,
      focusCancel: true,
    }).then(result => {
      if (result.isConfirmed) {
        deleteKeyword();
      }
    });
  }

  return (
    <div>
      <div className="flex items-end mb-8">
        <DoubleHeader
          preTitle={domain + ' »'}
          preTitleLink={`/domains/${domain}`}
          mainTitle={keyword}
        />
        <div className="p-2">
          <DeleteButton onClick={showDeletePopup} />
        </div>
      </div>
      {results.length > 0 && (
        <div>
          <Chart width={'100%'} results={results} />
        </div>
      )}
    </div>
  );
}
